import { Hexagon } from "./model/hexagon";

export function generateRectangleGrid(_rows: number, _cols: number): Hexagon[] {
	return [];
}

export function generateHexagonGrid(radius: number): Hexagon[] {
	const width = radius * 2 - 1;
	return Array
		.from({ length: width }, (_, q) => Array
			.from({ length: q }, (_, r) => r >= radius ? (radius + r) - (r - radius + 1) : radius + r)
			.map((_, r) => ({ q, r, s: - q - r })))
		.flat();
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
	return Array
		.from({ length: side }, (_, q) => Array
			.from({ length: q }, (_, r) => ({ q, r, s: -q - r })))
		.flat();
}

/**
 * @see https://www.redblobgames.com/grids/hexagons/implementation.html#shape-triangle
 */
export function generateUpTriangleGrid(side: number): Hexagon[] {
	return Array
		.from({ length: side }, (_, q) => Array
			.from({ length: q }, (_, r) => side - r)
			.map((_, r) => ({ q, r, s: - q - r })))
		.flat();
}
