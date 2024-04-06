/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import sun from "../assets/sun.svg";
import moon from "../assets/moon.svg";
import { Switch } from "@/components/ui/switch";

function Navbar({
	setTheme,
	theme,
}: {
	setTheme: React.Dispatch<React.SetStateAction<string>>;
	theme: string;
}) {
	return (
		<nav className='w-screen p-4 flex justify-between bg-white dark:bg-slate-900 text-black '>
			<div className='flex gap-3'>
				<Link to='/'>
					<Button>Todo List</Button>
				</Link>
				<Link to='currency'>
					<Button>Currency Converter</Button>
				</Link>
			</div>
			<div className='flex gap-2 items-center'>
				<img src={sun} width={40} />
				<Switch
					id='theme-toggle'
					checked={theme === "dark"}
					onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
				/>
				<img src={moon} width={40} />
			</div>
		</nav>
	);
}

export default Navbar;
