import type { Image } from "p5";
import type { Sketch } from "./app";

export enum GridDrawMode {
	RECTANGLE = "RECTANGLE",
	HEXAGON = "HEXAGON",
	RHOMBUS = "RHOMBUS",
	DOWN_TRIANGLE = "DOWN_TRIANGLE",
	UP_TRIANGLE = "UP_TRIANGLE",
}

interface DrawOptions<T extends PropertyKey> {
	colors: Record<T, string>;
	textures: Record<T, Image>;
	size?: number;
	onPoint?: boolean;
}

export function drawGrid<T extends PropertyKey>(sketch: Sketch, grid: T[][], { mode, ...options }: DrawOptions<T> & { mode?: GridDrawMode; }) {
	mode ??= GridDrawMode.RECTANGLE;
	switch(mode) {
		case GridDrawMode.RECTANGLE: return drawRectangleGrid(sketch, grid, options);
		case GridDrawMode.HEXAGON: return drawHexagonGrid(sketch, grid, options);
		case GridDrawMode.RHOMBUS: return drawRhombusGrid(sketch, grid, options);
		case GridDrawMode.DOWN_TRIANGLE: return drawDownTriangleGrid(sketch, grid, options);
		case GridDrawMode.UP_TRIANGLE: return drawUpTriangleGrid(sketch, grid, options);
		default: void (mode satisfies never);
	}
}

function drawRectangleGrid<T extends PropertyKey>(sketch: Sketch, grid: T[][], { colors, onPoint = false, size = 30, textures: _ }: DrawOptions<T>) {
	const horizontalSpacing = getPolygonSpacingHorizontal(size, onPoint);
	const verticalSpacing = getPolygonSpacingVertical(size, onPoint);

	sketch.translate(horizontalSpacing, verticalSpacing); // TODO: pre-compute size of tiles, and center accordingly

	grid
		.forEach((row, rowIndex) => row
			.forEach((cell, colIndex) => {
				const xOffset = onPoint && rowIndex % 2 ? verticalSpacing / 2 : 0;
				const yOffset = !onPoint && colIndex % 2 ? horizontalSpacing / 2 : 0;
				const x = colIndex * horizontalSpacing + xOffset;
				const y = rowIndex * verticalSpacing + yOffset;
				sketch.push();
				sketch.translate(x, y);
				sketch.fill(colors[cell]);
				// const img = textures[cell];
				// img.resize(horizontalSpacing * 2, verticalSpacing * 2);
				// sketch.background(img); // TODO: shape as mask for image
				// sketch.noStroke();
				drawHexagon(sketch, size, onPoint, String(cell));
				sketch.pop();
			}));
}

function drawHexagonGrid<T extends PropertyKey>(sketch: Sketch, _grid: T[][], _options: DrawOptions<T>) {
	sketch.translate(20, 40);
	sketch.fill(0);
	sketch.textSize(20);
	sketch.text("Not implemented", 0, 0);
}

function drawRhombusGrid<T extends PropertyKey>(sketch: Sketch, _grid: T[][], _options: DrawOptions<T>) {
	sketch.translate(20, 40);
	sketch.fill(0);
	sketch.textSize(20);
	sketch.text("Not implemented", 0, 0);
}

function drawDownTriangleGrid<T extends PropertyKey>(sketch: Sketch, _grid: T[][], _options: DrawOptions<T>) {
	sketch.translate(20, 40);
	sketch.fill(0);
	sketch.textSize(20);
	sketch.text("Not implemented", 0, 0);
}

function drawUpTriangleGrid<T extends PropertyKey>(sketch: Sketch, _grid: T[][], _options: DrawOptions<T>) {
	sketch.translate(20, 40);
	sketch.fill(0);
	sketch.textSize(20);
	sketch.text("Not implemented", 0, 0);
}



function getPolygonSpacingHorizontal(outerRadius: number, onPoint = false) {
	return onPoint ? Math.sqrt(3) * outerRadius : 3 * outerRadius / 2;
}

function getPolygonSpacingVertical(outerRadius: number, onPoint = false) {
	return onPoint ? 3 * outerRadius / 2 : Math.sqrt(3) * outerRadius;
}

function drawHexagon(sketch: Sketch, outerRadius = 30, onPoint = false, textStr = "") {
	drawPolygon(sketch, 6, outerRadius, onPoint);
	sketch.textAlign(sketch.CENTER, sketch.CENTER);
	if(textStr) {
		sketch.fill(0);
		sketch.textSize(outerRadius / 3);
		sketch.text(textStr, 0, 0);
	}
}

function drawPolygon(sketch: Sketch, outerRadius: number, size: number, onPoint = false) {
	const angle = sketch.TWO_PI / outerRadius;
	const offset = onPoint ? angle / 2 : 0;
	sketch.beginShape();
	for(let i = 0; i < outerRadius; i++) {
		const x = sketch.cos(angle * i + offset) * size;
		const y = sketch.sin(angle * i + offset) * size;
		sketch.vertex(x, y);
	}
	sketch.endShape(sketch.CLOSE);
}
