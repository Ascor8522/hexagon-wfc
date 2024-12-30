import { Hexagon, hexEquals, hexNeighbors } from "./model/hexagon";

export function wfc<T extends PropertyKey>(grid: Hexagon[], ruleset: Record<T, T[]>, random: () => number): (Hexagon & { value: T; })[] {
	type WithValues = Hexagon & { values: T[]; };

	if(Object.keys(ruleset).length === 0) throw new Error("Ruleset must not be empty");

	const rules = Object.keys(ruleset) as T[];
	const arr = grid.map(hex => ({ ...hex, values: rules }));

	let iter = 0;
	while(true) {
		const impossible = arr.some(hex => !hex.values.length);
		if(impossible) throw new Error("No possible values");

		const done = arr.every(hex => hex.values.length === 1);
		if(done) return arr.map(({ values, ...hex }) => ({ ...hex, value: values[0] }));

		const timeout = iter++ > grid.length * rules.length * 2;
		if(timeout) throw new Error("Too many iterations");

		const workable = arr
			.reduce(({ min, hexes }, hex) => {
				const newLen = hex.values.length;
				if(newLen < min && newLen > 1) {
					min = newLen;
					hexes = [];
				}
				if(newLen === min) hexes.push(hex);
				return { min, hexes };
			}, { min: Infinity, hexes: [] as WithValues[] })
			.hexes;

		debugger;

		const randomHexIndex = Math.floor(random() * workable.length);
		const randomHex = workable[randomHexIndex];

		const currValues = randomHex.values;
		const newValue = currValues[Math.floor(random() * currValues.length)];

		workable[randomHexIndex].values = [newValue];

		hexNeighbors(randomHex)
			.map(hex => arr.find(h => hexEquals(h, hex)))
			.filter(hex => hex !== undefined)
			.forEach(hex => hex.values = hex.values.filter(val => ruleset[newValue].includes(val)));
	}
}
