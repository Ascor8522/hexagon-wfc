import type { Image } from "p5";
import type { Sketch } from "./components/app";
import { getBoundingBox, Hexagon, hexToXYCoordinates } from "./model/hexagon";

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
	radius: number;
	onPoint: boolean;
}

export function drawGrid<T extends PropertyKey>(sketch: Sketch, grid: (Hexagon & { value: T; })[], { colors, textures: _textures, radius, onPoint }: DrawOptions<T>) {
	const boundingBox = getBoundingBox(grid, radius, onPoint);
	const [vertical, horizontal] = getCenteringOffsets(sketch.width, sketch.height, boundingBox);
	sketch.translate(vertical, horizontal);

	grid
		.forEach((hex) => {
			const [x, y] = hexToXYCoordinates(hex, radius, onPoint);
			sketch.push();
			sketch.translate(x, y);
			sketch.fill(colors[hex.value]);
			// TODO: display texture
			// const img = textures[cell];
			// img.resize(horizontalSpacing * 2, verticalSpacing * 2);
			// sketch.background(img); // TODO: shape as mask for image
			// sketch.noStroke();
			drawHexagon(sketch, radius, onPoint, `${String(hex.value)}`);
			sketch.pop();
		});
}

export function drawErrorMessage(sketch: Sketch, message: string, details?: string) {
	sketch.fill(255, 0, 0, 100);
	sketch.textAlign(sketch.CENTER, sketch.CENTER);
	sketch.textSize(sketch.height / 4);
	sketch.text(message, sketch.width / 2, sketch.height / 2 - 50);
	if(details) {
		sketch.textSize(sketch.height / 8);
		sketch.text(details, sketch.width / 2, sketch.height / 2 + 50);
	}
}

function drawHexagon(sketch: Sketch, radius: number, onPoint: boolean, textStr?: string) {
	drawPolygon(sketch, 6, radius, onPoint);
	sketch.textAlign(sketch.CENTER, sketch.CENTER);
	if(textStr) {
		sketch.fill(0);
		sketch.textSize(radius / 3);
		sketch.text(textStr, 0, 0);
	}
}

function drawPolygon(sketch: Sketch, sides: number, radius: number, onPoint = false) {
	const angle = sketch.TWO_PI / sides;
	const offset = onPoint ? angle / 2 : 0;
	sketch.beginShape();
	for(let i = 0; i < sides; i++) {
		const x = Math.cos(angle * i + offset) * radius;
		const y = Math.sin(angle * i + offset) * radius;
		sketch.vertex(x, y);
	}
	sketch.endShape(sketch.CLOSE);
}

function getCenteringOffsets(width: number, height: number, [left, right, top, bottom]: [number, number, number, number]): [number, number] {
	const elWidth = Math.max(left, right) - Math.min(left, right);
	const elHeight = Math.max(top, bottom) - Math.min(top, bottom);

	const marginHorizontal = (width - elWidth) / 2;
	const marginVertical = (height - elHeight) / 2;

	return [
		marginHorizontal - left,
		marginVertical - bottom,
	];
}
