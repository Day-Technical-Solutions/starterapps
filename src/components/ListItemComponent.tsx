/** @format */

import {useState} from "react";
import {ListItem} from "./Todo";
import x from "../assets/x.svg";

function ListItemComponent({
	item,
	updateItem,
	deleteItem,
}: {
	item: ListItem;
	updateItem: (key: number) => void;
	deleteItem: (key: number) => void;
}) {
	const [isChecked, setIsChecked] = useState(item.status === "Completed");

	return (
		item.name && (
			<div
				data-testid="list-item"
				className={
					(item.status === "Completed" ? "bg-gray-600" : "") +
					" mt-2 rounded-lg border border-slate-500 flex items-center p-3 gap-2 justify-between"
				}
				key={item.key}>
				<div className="flex gap-2 font-bold">
					<input
						name={`${item.key}_checkbox`}
						type="checkbox"
						checked={isChecked}
						onChange={() => {
							setIsChecked((prev) => !prev);
							updateItem(item.key);
						}}
					/>
					<label
						className={item.status === "Completed" ? "line-through" : ""}
						onClick={() => {
							setIsChecked((prev) => !prev);
							updateItem(item.key);
						}}
						htmlFor={`${item.key}_checkbox`}>
						{item.name}
					</label>
				</div>
				<div
					className="self-end"
					onClick={() => {
						deleteItem(item.key);
					}}>
					<img src={x} width={26} className="cursor-pointer" />
				</div>
			</div>
		)
	);
}

export default ListItemComponent;
