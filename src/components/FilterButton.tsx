/** @format */

import React from "react";
import { Button } from "./ui/button";

function FilterButton({
	setActive,
	active,
	label,
}: {
	active: string;
	label: string;
	setActive: React.Dispatch<React.SetStateAction<string>>;
}) {
	return (
		<Button
			className={
				"rounded-full border border-slate-500 " +
				(active === label
					? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 "
					: "bg-transparent text-slate-900 dark:text-white hover:text-white dark:hover:text-slate-900")
			}
			onClick={() => setActive(label)}
		>
			{label}
		</Button>
	);
}

export default FilterButton;
