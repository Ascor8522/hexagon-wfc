// @ts-ignore
import { prng_alea } from "esm-seedrandom";
import type { Image } from "p5";
import { useEffect, useRef, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import styles from "./app.module.css";
import { Biome, colors, neighbors, textures as t } from "./biome";
import { drawGrid, GridDrawMode } from "./draw";
import { wfc } from "./wfc";

import p5 from "p5";

export type Sketch = any; // FIXME

interface Settings {
	shape: GridDrawMode;
	rows: number;
	cols: number;
	onPoint: boolean;
	hexSize: number;
	seed: string;
	width: number;
	height: number;
}

const randomSeed = () => Math.random().toString(36).substring(2, 2 + 1 + Math.round(Math.random() * 10));

const defaultSettings: Settings = {
	shape: GridDrawMode.RECTANGLE,
	rows: 5,
	cols: 6,
	onPoint: true,
	hexSize: 50,
	seed: randomSeed(),
	width: 650,
	height: 450,
};

export default function App() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [settings, setSettings] = useState(defaultSettings);
	const { shape, rows, cols, onPoint, hexSize, seed, width, height } = settings;

	const [textures, setTextures] = useState<Record<Biome, Image> | null>(null);

	const setShapeHndlr = (e: JSX.TargetedEvent<HTMLSelectElement>) => setSettings({ ...settings, shape: e.currentTarget.value as GridDrawMode });
	const setRowsHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setSettings({ ...settings, rows: +e.currentTarget.value });
	const setColsHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setSettings({ ...settings, cols: +e.currentTarget.value });
	const setOnPointHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setSettings({ ...settings, onPoint: e.currentTarget.checked });
	const setHexSizeHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setSettings({ ...settings, hexSize: +e.currentTarget.value });
	const setSeedHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setSettings({ ...settings, seed: e.currentTarget.value });
	const randomizeSeedHndlr = () => setSettings({ ...settings, seed: randomSeed() });
	const setWidthHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setSettings({ ...settings, width: +e.currentTarget.value });
	const setHeightHndlr = (e: JSX.TargetedInputEvent<HTMLInputElement>) => setSettings({ ...settings, height: +e.currentTarget.value });
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
		new p5((sketch) => {
			sketch.preload = () => {
				const prom = Object
					.entries(t)
					.map(([key, value]) => [key, sketch.loadImage(value)] as [Biome, Image]);
				setTextures(Object.fromEntries(prom) as Record<Biome, Image>);
			};
		});
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if(!canvas) return;

		if(!textures) return;

		new p5((sketch) => {
			sketch.setup = () => {
				sketch.createCanvas(width, height, canvas);
				while(true) {
					try {
						const grid = wfc(rows, cols, neighbors, rnd);
						drawGrid(sketch, grid, { colors, size: hexSize, onPoint, textures, mode: shape });
						break;
					} catch(_e) { }
				}
				sketch.noLoop();
			};
		});
	}, [settings, textures]);

	return (
		<div style={styles}>
			<h1>Hexagon Wave Function Collapse</h1>

			<nav>
				<fieldset>
					<legend>Grid</legend>
					<label>
						Arrangement
						<select onChange={setShapeHndlr}>
							{Object.values(GridDrawMode).map((mode) => <option selected={mode === shape} value={mode}>{mode}</option>)}
						</select>
					</label>
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
					<legend>Tiles</legend>
					<label>
						On Point
						<input
							type="checkbox"
							checked={onPoint}
							onInput={setOnPointHndlr} />
					</label>
					<label>
						Size (px)
						<span>
							{hexSize}
							&nbsp;
							<input
								type="range"
								value={hexSize}
								min={1}
								step={1}
								title={hexSize.toString()}
								onInput={setHexSizeHndlr} />
						</span>
					</label>
				</fieldset>
				<fieldset>
					<legend>Map</legend>
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
				<fieldset>
					<legend>Image</legend>
					<label>
						Width (px)
						<input
							type="number"
							value={width}
							min={1}
							onInput={setWidthHndlr} />
					</label>
					<label>
						Height (px)
						<input
							type="number"
							value={height}
							min={1}
							onInput={setHeightHndlr} />
					</label>
				</fieldset>
				<button onClick={saveImageHndlr}>Save Image</button>
			</nav>

			<canvas ref={canvasRef} />
		</div>
	);
}
