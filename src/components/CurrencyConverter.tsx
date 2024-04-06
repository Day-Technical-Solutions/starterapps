/** @format */
import {useEffect, useState} from "react";
import CurrencyCard from "./CurrencyCard";
import circlePlus from "../assets/circlePlus.svg";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Label} from "./ui/label";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "./ui/select";

export type CurrencyPair = {
	key: string;
	source: string;
	target: string;
};

function CurrencyConverter() {
	let datacheck = sessionStorage.getItem("cData") ?? null;
	const prevData = datacheck ? JSON.parse(datacheck) : null;
	const [pairList, setPairList] = useState<CurrencyPair[]>(
		prevData ?? [
			{
				key: "USD_INR_1",
				source: "USD",
				target: "INR",
			},
			{
				key: "USD_CAD_2",
				source: "USD",
				target: "CAD",
			},
			{
				key: "GBP_JPY_3",
				source: "GBP",
				target: "JPY",
			},
			{
				key: "VND_RMB_4",
				source: "VND",
				target: "RMB",
			},
			{
				key: "CHF_EUR_5",
				source: "CHF",
				target: "EUR",
			},
			{
				key: "EUR_AUD_6",
				source: "EUR",
				target: "AUD",
			},
		]
	);
	const [source, setSource] = useState("");
	const [target, setTarget] = useState("");
	const [count, setCount] = useState(pairList.length + 1);
	const [selectorValues, setSelectorValues] = useState<string[]>([]);

	useEffect(() => {
		const prevSessionData: CurrencyPair[] = datacheck ? JSON.parse(datacheck) : [];
		prevSessionData.length > 0 ? setPairList(prevSessionData) : null;
		const fetchUSD = async () => {
			const response = await fetch("https://open.er-api.com/v6/latest/USD");
			const data = await response.json();
			sessionStorage.setItem("USD", JSON.stringify(data));
			sessionStorage.setItem("time_next_update_unix", data["time_next_update_unix"]);
			sessionStorage.setItem("time_last_update_utc", data["time_last_update_utc"]);
			setSelectorValues(Object.keys(data.rates));
		};
		fetchUSD();
	}, []);

	const handleInvertPair = (key: string) => {
		for (const pair of pairList) {
			if (pair.key === key) {
				let temp = pair.source;
				pair.source = pair.target;
				pair.target = temp;
			}
		}
		const newPair = pairList.slice();
		setPairList(newPair);
		sessionStorage.setItem("cData", JSON.stringify(newPair));
	};

	const handleDeletePair = (key: string) => {
		const newPairList = pairList.filter((pair) => pair.key !== key);
		setPairList(newPairList);
		sessionStorage.setItem("cData", JSON.stringify(newPairList));
	};

	const handleAddPair = () => {
		if (source && target) {
			setPairList((prev) => [...prev, {key: `${source}_${target}_${count}`, source, target}]);
			setCount((prev) => prev + 1);
			sessionStorage.setItem("cData", JSON.stringify(pairList));
		}
	};

	return (
		<div className="flex flex-wrap gap-5 p-12 w-full h-full">
			{pairList.map((pair, index) => (
				<CurrencyCard
					key={index + pair.key}
					id={pair.key}
					symbol={pair.source}
					target={pair.target}
					handleInvertPair={handleInvertPair}
					handleDeletePair={handleDeletePair}
				/>
			))}
			<AlertDialog>
				<AlertDialogTrigger className="fixed right-10 bottom-10">
					<img
						src={circlePlus}
						className="rounded-full transition-all bg-slate-900 hover:bg-white dark:hover:bg-slate-900 dark:bg-white"
						width={80}
					/>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Add Currency Pair</AlertDialogTitle>
					</AlertDialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="source" className="text-right">
								Source Currency
							</Label>
							<Select
								onValueChange={(e) => {
									setSource(e.toString());
								}}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Select Currency" />
								</SelectTrigger>
								<SelectContent>
									{selectorValues.length > 0 &&
										selectorValues.map((value: string, index: number) => (
											<SelectItem key={index} value={value}>
												{value}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="target" className="text-right">
								Target Currency
							</Label>
							<Select
								onValueChange={(e) => {
									setTarget(e.toString());
								}}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Select Currency" />
								</SelectTrigger>
								<SelectContent>
									{selectorValues.length > 0 &&
										selectorValues.map((value: string, index: number) => (
											<SelectItem key={index} value={value}>
												{value}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<AlertDialogFooter>
						<AlertDialogAction onClick={() => handleAddPair()}>Add</AlertDialogAction>
						<AlertDialogCancel>Close</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

export default CurrencyConverter;
