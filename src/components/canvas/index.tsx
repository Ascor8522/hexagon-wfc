// @ts-ignore
import { prng_alea } from 'esm-seedrandom';
import { Application, Assets, Texture } from "pixi.js";
import { ForwardedRef, forwardRef } from "preact/compat";
import { useEffect, useImperativeHandle, useState } from "preact/hooks";

import { Biome, neighbors } from "../../model/biome";
import { generateDownTriangleGrid, generateHexagonGrid, generateRectangleGrid, generateRhombusGrid, generateUpTriangleGrid, GridShape } from "../../model/grid";
import { getBoundingBox, Hexagon } from "../../model/hexagon";
import { wfc } from "../../model/wfc";
import { Settings } from "../app";
import { drawErrorMessage, drawGrid, getCenteringOffsets } from "./draw";

const Canvas = forwardRef((props: CanvasProps, ref: ForwardedRef<CanvasRef>) => {
	const [app, setApp] = useState<Application | null>(null);
	const [loadedTextures, setLoadedTextures] = useState<Partial<Record<Biome, Texture>>>({});

	useImperativeHandle(ref, () => ({
		saveImageHndlr: () => {
			if(!app) return;

			app
				.renderer
				.extract
				.image(app.stage)
				.then(img => img.src)
				.then(src => src.replace("image/png", "image/octet-stream"))
				.then(url => {
					const a = document.createElement("a");
					a.href = url;
					a.download = "map.png";
					a.click();
				});
		},
	}));

	useEffect(() => {
		const newApp = new Application();

		newApp
			.init({ width: props.width, height: props.height, backgroundAlpha: 0 })
			.then(() => {
				setApp(newApp);
				document.getElementById("canvas-container")!.appendChild(newApp.canvas);
			});

		return () => {
			newApp.destroy();
			document.getElementById("canvas-container")!.removeChild(newApp.canvas);
		};
	}, []);

	useEffect(() => {
		const promises = Object
			.entries(props.textures)
			.map(async ([name, file]) => {
				const texture = await Assets.load({
					src: URL.createObjectURL(file),
					format: file.type,
					loadParser: 'loadTextures',
				}) as unknown as Promise<Texture>;
				return [name, texture] as const;
			});
		Promise
			.all(promises)
			.then(res => Object.fromEntries(res))
			.then(textures => setLoadedTextures(textures));
	}, [props.textures]);

	useEffect(() => {
		if(!app?.stage) return;

		app.stage.removeChildren();
		app.renderer.resize(props.width, props.height);

		const rnd = prng_alea(props.seed);

		try {
			let emptyGrid: Hexagon[];
			switch(props.shape) {
				case GridShape.RECTANGLE: emptyGrid = generateRectangleGrid(props.rows, props.cols, props.onPoint); break;
				case GridShape.HEXAGON: emptyGrid = generateHexagonGrid(props.hexagonGridRadius); break;
				case GridShape.RHOMBUS: emptyGrid = generateRhombusGrid(props.rows, props.cols); break;
				case GridShape.DOWN_TRIANGLE: emptyGrid = generateDownTriangleGrid(props.triangleHeight); break;
				case GridShape.UP_TRIANGLE: emptyGrid = generateUpTriangleGrid(props.triangleHeight); break;
				default: void (props.shape satisfies never);
			}
			const grid = wfc(emptyGrid!, neighbors, rnd);
			const container = drawGrid(grid, props.radius, loadedTextures, props.onPoint);

			const boundingBox = getBoundingBox(grid, props.radius, props.onPoint);
			const [vertical, horizontal] = getCenteringOffsets(props.width, props.height, boundingBox);
			container.x = vertical;
			container.y = horizontal;

			app.stage.addChild(container);
		} catch(e) {
			drawErrorMessage(app.stage, "Not Possible", e instanceof Error ? e.message : String(e));
		}
	}, [app, props, loadedTextures]);

	return <div id="canvas-container" />;
});

export default Canvas;

interface CanvasProps extends Settings {
	textures: Partial<Record<Biome, File>>;
	hexagonGridRadius: number;
	triangleHeight: number;
}

interface CanvasRef {
	saveImageHndlr(): void;
}
