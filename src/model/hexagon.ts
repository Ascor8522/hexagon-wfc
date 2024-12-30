export interface Hexagon {
	q: number;
	r: number;
	s: number;
}

export function hexEquals(a: Hexagon, b: Hexagon) {
	return a.q === b.q && a.r === b.r && a.s === b.s;
}

export function hexAdd(a: Hexagon, b: Hexagon): Hexagon {
	return {
		q: a.q + b.q,
		r: a.r + b.r,
		s: a.s + b.s,
	};
}

export function hexNeighbors(hex: Hexagon): Hexagon[] {
	return [
		{ q: 1, r: 0, s: -1 },
		{ q: 1, r: -1, s: 0 },
		{ q: 0, r: -1, s: 1 },
		{ q: -1, r: 0, s: 1 },
		{ q: -1, r: 1, s: 0 },
		{ q: 0, r: 1, s: -1 },
	]
		.map(h => hexAdd(hex, h));
}

/**
 * @see https://www.redblobgames.com/grids/hexagons/#hex-to-pixel
 */
export function hexToXYCoordinates(hex: Hexagon, size: number, onPoint: boolean): [number, number] {
	const x = size * (onPoint ? Math.sqrt(3) * (hex.q + hex.r / 2) : 3 * hex.q / 2);
	const y = size * (onPoint ? 3 * hex.r / 2 : Math.sqrt(3) * (hex.q / 2 + hex.r));
	return [x, y];
}
