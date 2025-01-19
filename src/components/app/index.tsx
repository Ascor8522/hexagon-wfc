import { useCallback, useState } from "preact/hooks";

import { Biome } from "../../model/biome";
import { GridShape } from "../../model/grid";
import Canvas from "../canvas";
import Settings from "../settings";

import { createRef } from "preact";
import styles from "./styles.module.css";

export interface Settings {
	shape: GridShape;
	rows: number;
	cols: number;
	onPoint: boolean;
	radius: number;
	seed: string;
	width: number;
	height: number;
}

export type SetterHndlr<T extends Record<string, any>> = T & {
	[K in keyof T as K extends string ? `set${Capitalize<K>}Hndlr` : never]: (value: T[K]) => void;
};

const randomSeed = () => Math.random().toString(36).substring(2, 2 + 1 + Math.round(Math.random() * 10));

const defaultSettings: Settings = {
	shape: GridShape.HEXAGON,
	rows: 5,
	cols: 6,
	onPoint: false,
	radius: 40,
	seed: randomSeed(),
	width: 650,
	height: 450,
};

export type CanvasFns = {
	saveImageHndlr(): void;
};

export default function App() {
	const canvasRef = createRef<CanvasFns>();
	const [settings, setSettings] = useState(defaultSettings);
	const [textureFiles, setTextureFiles] = useState<Partial<Record<Biome, File>>>({});

	const { rows, cols } = settings;
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

	const addTextureImagesHndlr = useCallback(async (files: File[]) => {
		const tuples = files
			.map(file => {
				const name = file.name.replace("." + file.type.split("/")[1], "");
				return [name, file];
			});
		const newFiles = Object.fromEntries(tuples);

		setTextureFiles(prevImages => {
			const result = Object.fromEntries([
				...Object.entries(prevImages),
				...Object.entries(newFiles),
			]);
			return result;
		});
	}, []);

	const removeTextureImagesHndlr = useCallback((name: Biome) => {
		setTextureFiles(prevImages => {
			delete prevImages[name];
			return { ...prevImages };
		});
	}, []);

	const removeAllTextureImagesHndlr = useCallback(() => {
		setTextureFiles({});
	}, []);

	return (
		<div class={styles.app}>
			<h1>Hexagon Wave Function Collapse</h1>

			<Settings {...{
				...settings,
				textureFiles,
				addTextureImagesHndlr,
				removeTextureImagesHndlr,
				removeAllTextureImagesHndlr,
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
				saveImageHndlr: () => canvasRef.current?.saveImageHndlr(),
			}} />

			<hr />

			<span class="canvas-container">
				<Canvas
					{...{
						...settings,
						hexagonGridRadius,
						triangleHeight,
						textures: textureFiles,
					}}
					ref={canvasRef} />
			</span>
		</div>
	);
}
