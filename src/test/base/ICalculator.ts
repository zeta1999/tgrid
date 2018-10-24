import * as std from "tstl";

import { Promisify } from "../../base/Promisify";
import { Calculator } from "./Calculator";

export type ICalculator = Promisify<Calculator>;

export namespace ICalculator
{
	export async function main(driver: ICalculator, talk: boolean = false): Promise<void>
	{
		// VALIDATOR
		let validator: Calculator = new Calculator();

		// CALL FUNCTIONS IN SERVER FROM CLIENT
		for (let i: number = 0; i < 100; ++i)
			validate(driver, validator, talk);

		// EXCEPTION THROWN BY THE SERVER
		if (await get_exception(driver) === null)
			throw new std.DomainError("Throwing exception doesn't work.");
	}

	async function validate(driver: ICalculator, validator: Calculator, talk: boolean): Promise<void>
	{
		if (driver === <any>validator)
			throw new std.InvalidArgument("Mistaken arguments.");

		// SPECIFY METHODS
		let method: string = METHODS[std.randint(0, METHODS.length - 1)];
		let x: number = std.randint(2, 10);
		let y: number = std.randint(2, 10);

		// CALL FUNCTION & GET ANSWER
		let ret: number = await eval(`driver.${method}`)(x, y);
		let answer: number = eval(`validator.${method}(x, y)`);

		if (talk)
			console.log(method, x, y, ret, answer);
		
		// VALIDATE
		if (ret !== answer)
			throw new std.DomainError("Error on function calling.");
	}

	export async function get_exception(driver: ICalculator): Promise<string>
	{
		try 
		{ 
			await driver.divides(2, 0); 
		}
		catch (exp) 
		{
			return exp.message; 
		}
		return null;
	}

	const METHODS: string[] = [
		/*"plus", "minus", "multiplies", "divides",
		"scientific.pow", "scientific.log", "scientific.sqrt",
		"statistics.mean", */"statistics.stdev"
	];
}

