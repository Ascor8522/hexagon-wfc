export interface Hexagon {
	q: number;
	r: number;
	s: number;
}

export function hexEquals(a: Hexagon, b: Hexagon) {
	return a.q === b.q
		&& a.r === b.r
		&& a.s === b.s;
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
export function hexToXYCoordinates(hex: Hexagon, radius: number, onPoint: boolean): [number, number] {
	const x = radius * (onPoint ? Math.sqrt(3) * (hex.q + hex.r / 2) : 3 * hex.q / 2);
	const y = radius * (onPoint ? 3 * hex.r / 2 : Math.sqrt(3) * (hex.q / 2 + hex.r));
	return [x, y];
}

export function getBoundingBox(grid: Hexagon[], radius: number, onPoint: boolean): [number, number, number, number] {
	if(grid.length === 0) return [0, 0, 0, 0];

	type Side = "left" | "right" | "top" | "bottom";
	const { left, right, top, bottom } = grid
		.reduce(({ left, right, top, bottom }: Record<Side, Hexagon | null>, hex) => {
			if(!left || !right || !top || !bottom) return { left: hex, right: hex, top: hex, bottom: hex };

			if(hex.q < left.q) left = hex;
			if(hex.q > right.q || (hex.q === right.q && hex.s < right.s)) right = hex;
			if(hex.r > top.r || (hex.r === top.r && hex.s < top.s)) top = hex;
			if(hex.r < bottom.r) bottom = hex;

			return { left, right, top, bottom };
		}, { left: null, right: null, top: null, bottom: null }) as Record<Side, Hexagon>;

	const apothem = getApothem(radius);

	return [
		hexToXYCoordinates(left, radius, onPoint)[0] - (onPoint ? apothem : radius),
		hexToXYCoordinates(right, radius, onPoint)[0] + (onPoint ? apothem : radius),
		hexToXYCoordinates(top, radius, onPoint)[1] + (onPoint ? radius : apothem),
		hexToXYCoordinates(bottom, radius, onPoint)[1] - (onPoint ? radius : apothem),
	];
}

export function getApothem(radius: number) {
	return radius * Math.sqrt(3) / 2;
}
