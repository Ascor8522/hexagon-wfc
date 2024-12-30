import { Hexagon } from "./model/hexagon";

export function generateRectangleGrid(rows: number, cols: number, onPoint: boolean): Hexagon[] {
	// FIXME: improve
	const grid: Hexagon[] = [];
	const top = 0;
	const bottom = rows - 1;
	const left = 0;
	const right = cols - 1;
	if(onPoint) {
		for(let r = top; r <= bottom; r++) { // pointy top
			const r_offset = Math.floor(r / 2.0); // or r>>1
			for(let q = left - r_offset; q <= right - r_offset; q++) {
				grid.push({ q, r, s: - q - r });
			}
		}
	} else {
		for(let q = left; q <= right; q++) { // flat top
			const q_offset = Math.floor(q / 2.0); // or q>>1
			for(let r = top - q_offset; r <= bottom - q_offset; r++) {
				grid.push({ q, r, s: - q - r });
			}
		}
	}
	return grid;
}

export function generateHexagonGrid(radius: number): Hexagon[] {
	// FIXME: improve
	const grid: Hexagon[] = [];
	const N = radius - 1;
	for(let q = -N; q <= N; q++) {
		const r1 = Math.max(-N, -q - N);
		const r2 = Math.min(N, -q + N);
		for(let r = r1; r <= r2; r++) {
			grid.push({ q, r, s: - q - r });
		}
	}
	return grid;

	// const width = radius * 2 - 1;
	// return Array
	// 	.from({ length: width }, (_, q) => Array
	// 		.from({ length: q }, (_, r) => r >= radius ? (radius + r) - (r - radius + 1) : radius + r)
	// 		.map((_, r) => ({ q, r, s: - q - r })))
	// 	.flat();
}

/**
 * @see https://www.redblobgames.com/grids/hexagons/implementation.html#shape-parallelogram
 */
export function generateRhombusGrid(rows: number, cols: number): Hexagon[] {
	return Array
		.from({ length: cols }, (_, q) => Array
			.from({ length: rows }, (_, r) => ({ q, r, s: - q - r })))
		.flat();
}

/**
 * @see https://www.redblobgames.com/grids/hexagons/implementation.html#shape-triangle
 */
export function generateDownTriangleGrid(side: number): Hexagon[] {
	// FIXME: improve
	const grid: Hexagon[] = [];
	for(let q = 0; q <= side; q++) {
		for(let r = 0; r <= side - q; r++) {
			grid.push({ q, r, s: - q - r });
		}
	}
	return grid;

	// return Array
	// 	.from({ length: side }, (_, q) => Array
	// 		.from({ length: q }, (_, r) => ({ q, r, s: -q - r })))
	// 	.flat();
}

/**
 * @see https://www.redblobgames.com/grids/hexagons/implementation.html#shape-triangle
 */
export function generateUpTriangleGrid(side: number): Hexagon[] {
	// FIXME: improve
	const grid: Hexagon[] = [];
	for(let q = 0; q <= side; q++) {
		for(let r = side - q; r <= side; r++) {
			grid.push({ q, r, s: - q - r });
		}
	}
	return grid;

	// return Array
	// 	.from({ length: side }, (_, q) => Array
	// 		.from({ length: q }, (_, r) => side - r)
	// 		.map((_, r) => ({ q, r, s: - q - r })))
	// 	.flat();
}
