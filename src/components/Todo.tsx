/** @format */

import {useState} from "react";
import {Button} from "./ui/button";
import FilterButton from "./FilterButton";
import ListItemComponent from "./ListItemComponent";

export type ListItem = {
	key: number;
	name: string;
	status: "Pending" | "Completed";
};

function Todo() {
	const [active, setActive] = useState("All");

	let datacheck = sessionStorage.getItem("data") ?? null;
	const prevSessionData: ListItem[] = datacheck ? JSON.parse(datacheck) : null;
	const [listItems, setListItems] = useState<ListItem[]>(
		prevSessionData
			? prevSessionData
			: [
					{
						key: 1,
						name: "Sample Item 1",
						status: "Pending",
					},
					{
						key: 2,
						name: "Sample Item 2",
						status: "Completed",
					},
					{
						key: 3,
						name: "Sample Item 3",
						status: "Pending",
					},
			  ]
	);
	const [keyCount, setKeyCount] = useState(listItems.length + 1);
	const [input, setInput] = useState("");

	const handleAddItem = (name: string) => {
		setListItems([...listItems, {key: keyCount, name: name, status: "Pending"}]);
		setKeyCount((prev) => prev + 1);
		sessionStorage.setItem("data", JSON.stringify(listItems));
	};
	const handleDeleteItem = (key: number) => {
		setListItems(listItems.filter((item) => item.key !== key));
		sessionStorage.setItem("data", JSON.stringify(listItems));
	};

	const handleUpdateItem = (key: number) => {
		for (const item of listItems) {
			if (item.key === key) item.status = item.status === "Pending" ? "Completed" : "Pending";
		}
		sessionStorage.setItem("data", JSON.stringify(listItems));
	};

	return (
		<div className="flex content-center justify-center p-10 px-20">
			<div className=" min-w-fit flex-col p-8 gap-5 w-full bg-white dark:bg-slate-900 rounded-lg text-center text-slate-900 dark:text-white">
				<div className="m-2">
					<span className="font-bold text-4xl">Todo App</span>
				</div>
				<div id="filters" className="flex gap-3 py-5 ">
					<FilterButton label="All" active={active} setActive={setActive} />
					<FilterButton label="Pending" active={active} setActive={setActive} />
					<FilterButton label="Completed" active={active} setActive={setActive} />
				</div>
				<div className="flex-col">
					{active === "All" &&
						listItems.map((item) => {
							return (
								<ListItemComponent
									key={item.key}
									item={item}
									updateItem={handleUpdateItem}
									deleteItem={handleDeleteItem}
								/>
							);
						})}
					{active !== "All" &&
						listItems.map((item) =>
							item.status === active ? (
								<ListItemComponent
									key={item.key}
									item={item}
									updateItem={handleUpdateItem}
									deleteItem={handleDeleteItem}
								/>
							) : null
						)}
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleAddItem(input);
						setInput("");
					}}>
					<div className="mt-6 rounded-lg border border-slate-500 flex items-center p-2">
						<input
							className="w-full h-full p-1 rounded-lg focus:outline-none bg-transparent"
							type="text"
							placeholder="Add Todo"
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
						<Button type="submit" className="rounded-full h-7">
							Add
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Todo;
