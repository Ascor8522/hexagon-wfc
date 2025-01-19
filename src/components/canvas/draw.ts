// @ts-ignore
import { prng_alea } from "esm-seedrandom";
import { Container, Graphics, Text, Texture } from "pixi.js";
import { getApothem, Hexagon, hexToXYCoordinates } from "../../model/hexagon";

type WithValue<T> = Hexagon & { value: T; };

export function drawGrid<T extends PropertyKey>(grid: WithValue<T>[], radius: number, textures: Partial<Record<T, Texture>>, onPoint: boolean) {
	const container = new Container();
	grid
		.forEach((hex) => {
			const hexagon = drawHexagon(radius, onPoint);

			const [x, y] = hexToXYCoordinates(hex, radius, onPoint);
			hexagon.x = x;
			hexagon.y = y;

			const texture = textures[hex.value];

			if(texture) {
				const width = (onPoint ? getApothem(radius) : radius) * 2;
				const height = (onPoint ? radius : getApothem(radius)) * 2;
				hexagon.texture(texture, undefined, -width / 2, -height / 2, width, height);
			} else {
				const h = prng_alea(hex.value).int32() % 360;
				hexagon.fill({ color: { h, s: 40, l: 45 } });
			}
			container.addChild(hexagon);

			if(!texture) {
				const text = new Text({ text: String(hex.value), style: { fontSize: radius / 3 } });
				text.x = x - (text.width / 2);
				text.y = y - (text.height / 2);
				container.addChild(text);
			}
		});

	return container;
}

export function drawErrorMessage(stage: Container, message: string, details?: string) {
	const messageText = new Text({ text: message, style: { fill: "red" } });
	messageText.height = stage.height / 4;
	messageText.x = (stage.width - messageText.width) / 2;
	messageText.y = (stage.height - messageText.height) / 2 - 50;
	stage.addChild(messageText);

	if(details) {
		const detailsText = new Text({ text: details });
		detailsText.height = stage.height / 8;
		detailsText.x = (stage.width - detailsText.width) / 2;
		detailsText.y = (stage.height - detailsText.height) / 2 + 50;
		return [messageText, detailsText];
	}

	return [messageText];
}

function drawHexagon(radius: number, onPoint: boolean) {
	return drawPolygon(6, radius, onPoint);
}

function drawPolygon(sides: number, radius: number, onPoint = false) {
	const angle = 2 * Math.PI / sides;
	const offset = onPoint ? angle / 2 : 0;
	const polygon = new Graphics();
	for(let i = 0; i < sides + 1; i++) {
		const x = Math.cos(angle * i + offset) * radius;
		const y = Math.sin(angle * i + offset) * radius;
		if(i === 0) polygon.moveTo(x, y);
		else polygon.lineTo(x, y);
	}
	return polygon;
}

export function getCenteringOffsets(width: number, height: number, [left, right, top, bottom]: [number, number, number, number]): [number, number] {
	const elWidth = Math.max(left, right) - Math.min(left, right);
	const elHeight = Math.max(top, bottom) - Math.min(top, bottom);

	const marginHorizontal = (width - elWidth) / 2;
	const marginVertical = (height - elHeight) / 2;

	return [
		marginHorizontal - left,
		marginVertical - bottom,
	];
}
