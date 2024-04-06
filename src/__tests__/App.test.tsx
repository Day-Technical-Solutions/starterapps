/** @format */

import {describe, expect, test} from "vitest";
import {render, screen} from "@testing-library/react";
import App from "@/App";
import CurrencyConverter from "@/components/CurrencyConverter";
import Todo from "@/components/Todo";

describe("App", () => {
	test("renders nav", () => {
		render(<App />);
		expect(screen.getByText("Todo List")).toBeDefined();
		expect(screen.getByText("Currency Converter")).toBeDefined();
	});
	test("renders currency cards", () => {
		render(<CurrencyConverter />);
		expect(screen.getAllByTestId("currency-card").length).toBe(6);
	});
	test("renders todo list items", () => {
		render(<Todo />);
		expect(screen.getAllByTestId("list-item").length).toBe(3);
	});
});
