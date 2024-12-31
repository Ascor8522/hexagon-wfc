// @ts-ignore
import { prng_alea } from "esm-seedrandom";
import p5, { type Image } from "p5";
import { useEffect, useRef, useState } from "preact/hooks";

import { Biome, colors, neighbors } from "../../biome";
import { drawErrorMessage, drawGrid, GridShape } from "../../draw";
import { generateDownTriangleGrid, generateHexagonGrid, generateRectangleGrid, generateRhombusGrid, generateUpTriangleGrid } from "../../grid";
import { Hexagon } from "../../model/hexagon";
import { wfc } from "../../wfc";
import Settings from "../settings";

import styles from "./styles.module.css";

export type Sketch = any; // FIXME

interface Settings {
	shape: GridShape;
	rows: number;
	cols: number;
	onPoint: boolean;
	radius: number;
	seed: string;
	width: number;
	height: number;
}

const randomSeed = () => Math.random().toString(36).substring(2, 2 + 1 + Math.round(Math.random() * 10));

const defaultSettings: Settings = {
	shape: GridShape.HEXAGON,
	rows: 5,
	cols: 6,
	onPoint: true,
	radius: 40,
	seed: randomSeed(),
	width: 650,
	height: 450,
};

export default function App() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [settings, setSettings] = useState(defaultSettings);
	const [loadedTextures, _setLoadedTextures] = useState<Record<Biome, Image> | null>(null);

	const { shape, rows, cols, onPoint, radius, seed, width, height } = settings;
	const hexagonGridRadius = Math.ceil((rows + 1) / 2);
	const triangleHeight = Math.max(rows, cols);

	const setShapeHndlr = (shape: GridShape) => setSettings({ ...settings, shape });
	const setRowsHndlr = (rows: number) => setSettings({ ...settings, rows });
	const setColsHndlr = (cols: number) => setSettings({ ...settings, cols });
	const setHexagonGridRadiusHndlr = (hexagonGridRadius: number) => setSettings({ ...settings, rows: (hexagonGridRadius * 2) - 1, cols: (hexagonGridRadius * 2) - 1 });
	const setTriangleHeightHndlr = (triangleHeight: number) => setSettings({ ...settings, rows: triangleHeight, cols: triangleHeight });
	const setOnPointHndlr = (onPoint: boolean) => setSettings({ ...settings, onPoint });
	const setRadiusHndlr = (radius: number) => setSettings({ ...settings, radius });
	const setSeedHndlr = (seed: string) => setSettings({ ...settings, seed });
	const randomizeSeedHndlr = () => setSettings({ ...settings, seed: randomSeed() });
	const setWidthHndlr = (width: number) => setSettings({ ...settings, width });
	const setHeightHndlr = (height: number) => setSettings({ ...settings, height });
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

	// TODO: preload textures
	// useEffect(() => {
	// 	new p5((sketch) => {
	// 		sketch.preload = () => {
	// 			const prom = Object
	// 				.entries(textures)
	// 				.map(([key, value]) => [key, sketch.loadImage(value)] as [Biome, Image]);
	// 			setLoadedTextures(Object.fromEntries(prom) as Record<Biome, Image>);
	// 		};
	// 	});
	// }, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if(!canvas) return;

		// if(!loadedTextures) return; // TODO: preload textures

		new p5((sketch) => {
			sketch.setup = () => {
				sketch.createCanvas(width, height, canvas);
				try {
					let emptyGrid: Hexagon[];
					switch(shape) {
						case GridShape.RECTANGLE: emptyGrid = generateRectangleGrid(rows, cols, onPoint); break;
						case GridShape.HEXAGON: emptyGrid = generateHexagonGrid(hexagonGridRadius); break;
						case GridShape.RHOMBUS: emptyGrid = generateRhombusGrid(rows, cols); break;
						case GridShape.DOWN_TRIANGLE: emptyGrid = generateDownTriangleGrid(triangleHeight); break;
						case GridShape.UP_TRIANGLE: emptyGrid = generateUpTriangleGrid(triangleHeight); break;
						default: void (shape satisfies never);
					}
					const grid = wfc(emptyGrid!, neighbors, rnd);
					drawGrid(sketch, grid, { colors, radius: radius, onPoint, textures: loadedTextures! });
				} catch(e) {
					drawErrorMessage(sketch, "Not Possible", e instanceof Error ? e.message : String(e));
				}
				sketch.noLoop();
			};
		});
	}, [settings, loadedTextures]);

	return (
		<div style={styles}>
			<h1>Hexagon Wave Function Collapse</h1>

			<Settings {...{
				...settings,
				hexagonGridRadius,
				triangleHeight,
				setShapeHndlr,
				setRowsHndlr,
				setColsHndlr,
				setHexagonGridRadiusHndlr,
				setTriangleHeightHndlr,
				setOnPointHndlr,
				setRadiusHndlr,
				setSeedHndlr,
				randomizeSeedHndlr,
				setWidthHndlr,
				setHeightHndlr,
				saveImageHndlr,
			}} />

			<span class="canvas-container">
				<canvas ref={canvasRef} />
			</span>
		</div>
	);
}
