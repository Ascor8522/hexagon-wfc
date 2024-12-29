// @ts-ignore
import { prng_alea } from "esm-seedrandom";
import type { Image } from "p5";
import { useEffect, useRef, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import styles from "./app.module.css";
import { Biome, colors, neighbors, textures } from "./biome";
import { drawGrid, GridDrawMode } from "./draw";
import { wfc } from "./wfc";

import p5 from "p5";

export type Sketch = any; // FIXME

export default function App() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	// TODO: merge into a single state object
	const [[width, height], setImageSize] = useState([600, 450] as [number, number]);
	const [[rows, cols], setGridSize] = useState([5, 6] as [number, number]);
	const [shape, setShape] = useState(GridDrawMode.RECTANGLE);
	const [seed, setSeed] = useState("seed");
	const [onPoint, setOnPoint] = useState(true);
	const [hexSize, setHexSize] = useState(50);

	const setWidthHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setImageSize([+e.currentTarget.value, height]);
	const setHeightHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setImageSize([width, +e.currentTarget.value]);
	const setShapeHndlr = (e: JSX.TargetedEvent<HTMLSelectElement>) => setShape(e.currentTarget.value as GridDrawMode);
	const setOnPointHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setOnPoint(e.currentTarget.checked);
	const setRowsHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setGridSize([+e.currentTarget.value, cols]);
	const setColsHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setGridSize([rows, +e.currentTarget.value]);
	const setSeedHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setSeed(e.currentTarget.value);
	const randomizeSeedHndlr = () => setSeed(Math.random().toString(36).substring(2, 2 + 1 + Math.round(Math.random() * 10)));
	const setHexSizeHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setHexSize(+e.currentTarget.value);
	const saveImageHndlr = () => {
		const canvas = canvasRef.current;
		if(!canvas) return;

		const link = document.createElement("a");
		link.download = `Map_${seed}.png`;
		link.href = canvas.toDataURL("image/png");
		link.click();
		document.body.removeChild(link);
	};


	const rnd = prng_alea(seed);

	useEffect(() => {
		const canvas = canvasRef.current;
		if(!canvas) return;

		new p5((sketch) => {
			let loadedTextures: Record<Biome, Image>;
			sketch.preload = () => {
				const prom = Object
					.entries(textures)
					.map(([key, value]) => [key, sketch.loadImage(value)] as const);
				loadedTextures = Object.fromEntries(prom) as Record<Biome, Image>;
			};
			sketch.setup = () => {
				sketch.createCanvas(width, height, canvas);
			};
			sketch.draw = () => {
				try {
					const grid = wfc(rows, cols, neighbors, rnd);
					drawGrid(sketch, grid, { colors, size: hexSize, onPoint, textures: loadedTextures, mode: shape });
				} catch(e) {
					alert(e instanceof Error ? e.message : e);
				}
				sketch.noLoop();
			};
		});
	}, [width, height, rows, cols, shape, seed, onPoint, hexSize]);

	return (
		<div style={styles}>
			<h1>Hexagon Wave Function Collapse</h1>

			<nav>
				<fieldset>
					<legend>Map Size (px)</legend>
					<label>
						Width
						<input
							type="number"
							value={width}
							min={1}
							onInput={setWidthHndlr} />
					</label>
					<label>
						Height
						<input
							type="number"
							value={height}
							min={1}
							onInput={setHeightHndlr} />
					</label>
				</fieldset>
				<fieldset>
					<legend>Shape</legend>
					<label>
						Shape
						<select onChange={setShapeHndlr}>
							{Object.values(GridDrawMode).map((mode) => <option selected={mode === shape} value={mode}>{mode}</option>)}
						</select>
					</label>
					<label>
						On Point
						<input
							type="checkbox"
							checked={onPoint}
							onInput={setOnPointHndlr} />
					</label>
				</fieldset>
				<fieldset>
					<legend>Grid Size</legend>
					{/* TODO: different inputs depending on the shape selected (e.g. radius or height) */}
					<label>
						Rows
						<input
							type="number"
							value={rows}
							min={1}
							onInput={setRowsHndlr} />
					</label>
					<label>
						Columns
						<input
							type="number"
							value={cols}
							min={1}
							onInput={setColsHndlr} />
					</label>
				</fieldset>
				<fieldset>
					<legend>Seed</legend>
					<label>
						Seed
						<input
							type="text"
							value={seed}
							onInput={setSeedHndlr} />
					</label>
					<label>
						<span />
						<button onClick={randomizeSeedHndlr}>Randomize</button>
					</label>
				</fieldset>
				<label>
					Hex Size
					<input
						type="range"
						value={hexSize}
						min={1}
						step={1}
						onChange={setHexSizeHndlr} />
				</label>
				<button onClick={saveImageHndlr}>Save Image</button>
			</nav>

			<canvas ref={canvasRef} />
		</div>
	);
}
