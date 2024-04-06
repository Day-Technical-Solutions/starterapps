/** @format */

import {useEffect, useState} from "react";
import doubleArrow from "../assets/doubleArrow.svg";
import circleX from "../assets/circleX.svg";
import circleArrows from "../assets/circularArrows.svg";
import validator from "validator";

export async function getSymbolRates(symbol: string) {
	const prevData = sessionStorage.getItem(symbol) ?? null;
	let data = prevData ? JSON.parse(prevData) : null;
	if (!data || (data && parseInt(data["time_next_update_unix"]) < Date.now())) {
		const response = await fetch(`https://open.er-api.com/v6/latest/${symbol}`);
		data = await response.json();
		if (data.result === "error") return "error";
		sessionStorage.setItem(symbol, JSON.stringify(data));
		sessionStorage.setItem("time_next_update_unix", data["time_next_update_unix"]);
		sessionStorage.setItem("time_last_update_utc", data["time_last_update_utc"]);
	}
	return data.rates;
}

function getTargetRate(symbol: string, target: string): number {
	const prevData = sessionStorage.getItem(symbol) ?? null;
	const data = prevData ? JSON.parse(prevData) : null;
	if (data && data.result === "error") return 0;
	return data ? data.rates[target] : 0;
}

function getLastUpdated(): string {
	const prevData = sessionStorage.getItem("time_last_update_utc") ?? null;
	const data = prevData ?? "";
	return data.slice(0, -5);
}

function CurrencyCard({
	id,
	symbol,
	target,
	handleInvertPair,
	handleDeletePair,
}: {
	id: string;
	symbol: string;
	target: string;
	handleInvertPair: (key: string) => void;
	handleDeletePair: (key: string) => void;
}) {
	const [currSymbol, setCurrSymbol] = useState(symbol);
	const [currTarget, setCurrTarget] = useState(target);
	const [symbolRate, setSymbolRate] = useState(1);
	const [targetRate, setTargetRate] = useState<number>(getTargetRate(symbol, target));
	const [conversionRate, setConversionRate] = useState<number>(symbolRate * targetRate);

	useEffect(() => {
		const updateComponent = async () => {
			await getSymbolRates(currSymbol);
			await getSymbolRates(currTarget);
			setSymbolRate((prev) => (prev > 1 ? prev : 1));
			setConversionRate(getTargetRate(currSymbol, currTarget) ?? 0);
			setTargetRate(symbolRate * (getTargetRate(currSymbol, currTarget) ?? 0));
		};
		updateComponent();
	}, [currSymbol, currTarget]);

	useEffect(() => {
		setTargetRate(symbolRate * conversionRate);
	}, [symbolRate]);

	return (
		<div
			data-testid="currency-card"
			className="flex w-[30rem] gap-1 h-52 bg-white rounded-lg border border-slate-400 dark:bg-slate-900">
			<div className="flex flex-col self-center p-2 w-1/4">
				<h1 className="font-bold text-4xl self-center text-emerald-600">{currSymbol}</h1>
				<img src={doubleArrow} width={80} className="m-4 self-center h-full" />
				<h1 className="font-bold text-4xl self-center text-emerald-600">{currTarget}</h1>
			</div>
			<div className="self-center font-bold text-2xl w-1/4 ">
				<p>{conversionRate.toFixed(3)}</p>
			</div>
			<div className="flex flex-col gap-2 mr-4 w-1/2">
				<div className="flex flex-row-reverse gap-2 justify-items-end mt-1 mb-2">
					<div className="rounded-full cursor-pointer" onClick={() => handleDeletePair(id)}>
						<img src={circleX} width={35} />
					</div>
					<div
						className="rounded-full cursor-pointer"
						onClick={() => {
							handleInvertPair(id);
							let temp = currSymbol;
							setCurrSymbol(currTarget);
							setCurrTarget(temp);
						}}>
						<img src={circleArrows} width={35} />
					</div>
				</div>
				<input
					type="number"
					className="rounded-sm bg-emerald-200 text-lime-800 p-1 border font-bold border-slate-600"
					defaultValue={symbolRate}
					onChange={(e) => {
						if (validator.isDecimal(e.target.value)) setSymbolRate(parseFloat(e.target.value));
					}}
				/>
				<input
					type="number"
					className="rounded-sm bg-emerald-200 text-lime-800 p-1 border font-bold border-slate-600"
					value={targetRate ? targetRate : 0}
					disabled
				/>
				<div className="grid justify-items-end mt-4 text-gray-400">
					<p className="font-bold text-md">Last Updated</p>
					<p className="text-sm">{getLastUpdated()}</p>
				</div>
			</div>
		</div>
	);
}

export default CurrencyCard;
