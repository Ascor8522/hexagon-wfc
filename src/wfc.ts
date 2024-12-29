export function wfc<T extends PropertyKey>(rows: number, cols: number, ruleset: Record<T, T[]>, random: () => number): T[][] {
	if(rows <= 0) throw new Error("Width must be greater than 0");
	if(cols <= 0) throw new Error("Height must be greater than 0");
	if(Object.keys(ruleset).length === 0) throw new Error("Ruleset must not be empty");

	const rules = Object.keys(ruleset) as T[];
	const arr = Array.from({ length: rows }, () => Array.from({ length: cols }, _ => rules.slice()));

	let iter = 0;
	while(true) {
		const cells = arr
			.map((_, row) => _.map((cell, col): Cell => ({ row, col, count: cell.length })))
			.flat();

		const done = cells.every(cell => cell.count === 1);
		if(done) return arr.map(row => row.map(cell => cell[0]));

		const impossible = cells.some(cell => cell.count === 0);
		if(impossible) throw new Error("No possible values");

		if(iter++ > rows * cols * rules.length) throw new Error("Too many iterations");

		const workable = cells
			.reduce(({ minCount, cells }, cell) => {
				if(cell.count < minCount && cell.count > 1) {
					minCount = cell.count;
					cells = [];
				}
				if(cell.count === minCount) cells.push(cell);
				return { minCount, cells };
			}, { minCount: Infinity, cells: [] as Cell[] })
			.cells;

		const cell = workable[Math.floor(random() * workable.length)];
		const { col, row } = cell;
		const values = arr[row][col];
		const value = values[Math.floor(random() * values.length)];
		arr[row][col] = [value];

		[
			{ row: row - 1, col },
			{ row: row + 1, col },
			{ row, col: col - 1 },
			{ row, col: col + 1 },
		]
			.filter(({ row, col }) => row >= 0 && row < rows && col >= 0 && col < cols && arr[row][col].length > 1)
			.forEach(({ row, col }) => arr[row][col] = arr[row][col].filter(val => ruleset[value].includes(val)));
	}
}

interface Cell {
	row: number;
	col: number;
	count: number;
}
