import type { Image } from "p5";
import type { Sketch } from "./components/app";
import { Hexagon, hexToXYCoordinates } from "./model/hexagon";

export enum GridShape {
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

export function drawGrid<T extends PropertyKey>(sketch: Sketch, grid: (Hexagon & { value: T; })[], { colors, textures: _textures, size = 50, onPoint = true }: DrawOptions<T>) {
	const horizontalSpacing = getPolygonSpacingHorizontal(size, onPoint);
	const verticalSpacing = getPolygonSpacingVertical(size, onPoint);

	sketch.translate(horizontalSpacing, verticalSpacing); // TODO: pre-compute size of tiles, and center accordingly

	grid
		.forEach((hex) => {
			const [x, y] = hexToXYCoordinates(hex, size, onPoint);
			sketch.push();
			sketch.translate(x, y);
			sketch.fill(colors[hex.value]);
			// const img = textures[cell];
			// img.resize(horizontalSpacing * 2, verticalSpacing * 2);
			// sketch.background(img); // TODO: shape as mask for image
			// sketch.noStroke();
			drawHexagon(sketch, size, onPoint, String(hex.value));
			sketch.pop();
		});
}

export function drawNotPossible(sketch: Sketch, message?: string) {
	sketch.fill(255, 0, 0, 100);
	sketch.textAlign(sketch.CENTER, sketch.CENTER);
	sketch.textSize(100);
	sketch.text("Not Possible", sketch.width / 2, sketch.height / 2 - 50);
	if(message) {
		sketch.textSize(50);
		sketch.text(message, sketch.width / 2, sketch.height / 2 + 50);
	}
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
