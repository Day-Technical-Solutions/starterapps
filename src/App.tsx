/** @format */

import {useState, useEffect} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./App.css";
import Todo from "./components/Todo";
import Navbar from "./components/Navbar";
import CurrencyConverter from "./components/CurrencyConverter";

function App() {
	const pref = sessionStorage.getItem("theme") ?? null;
	const [theme, setTheme] = useState(pref ?? "light");

	useEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
			sessionStorage.setItem("theme", theme);
		} else {
			document.documentElement.classList.remove("dark");
			sessionStorage.setItem("theme", theme);
		}
	}, [theme]);

	return (
		<BrowserRouter>
			<div className="App">
				<Navbar theme={theme} setTheme={setTheme} />
				<Routes>
					<Route path="/" element={<Todo />} />
					<Route path="currency" element={<CurrencyConverter />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
