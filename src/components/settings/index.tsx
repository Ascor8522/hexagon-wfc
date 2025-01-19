import { Biome } from "../../model/biome";
import { GridShape } from "../../model/grid";
import { Settings as S, SetterHndlr } from "../app";
import FileInput from "../file-input";
import styles from "./styles.module.css";

export default function Settings(props: SettingsProps) {
	return (
		<nav class={styles.nav}>
			<fieldset>
				<legend>Biomes</legend>
				Textures
				<FileInput
					images={props.textureFiles}
					addTextureImagesHndlr={props.addTextureImagesHndlr}
					removeTextureImagesHndlr={props.removeTextureImagesHndlr}
					removeAllTextureImagesHndlr={props.removeAllTextureImagesHndlr} />
			</fieldset>
			<fieldset>
				<legend>Grid</legend>
				<label>
					Arrangement
					<select onChange={e => props.setShapeHndlr(e.currentTarget.value as GridShape)}>
						{Object
							.values(GridShape)
							.map((mode) => <>
								<option
									value={mode}
									selected={mode === props.shape}>
									{mode.toLowerCase().replace(/_/g, " ")}
								</option>
							</>)}
					</select>
				</label>
				{(props.shape === GridShape.RECTANGLE || props.shape === GridShape.RHOMBUS) && <>
					<label>
						Rows
						<input
							type="number"
							value={props.rows}
							min={1}
							step={1}
							onInput={e => props.setRowsHndlr(+e.currentTarget.value)} />
					</label>
					<label>
						Columns
						<input
							type="number"
							value={props.cols}
							min={1}
							step={1}
							onInput={e => props.setColsHndlr(+e.currentTarget.value)} />
					</label>
				</>}
				{(props.shape === GridShape.HEXAGON) && <>
					<label>
						Radius
						<input
							type="number"
							value={props.hexagonGridRadius}
							min={1}
							step={1}
							onInput={e => props.setHexagonGridRadiusHndlr(+e.currentTarget.value)} />
					</label>
				</>}
				{(props.shape === GridShape.UP_TRIANGLE || props.shape === GridShape.DOWN_TRIANGLE) && <>
					<label>
						Height
						<input
							type="number"
							value={props.triangleHeight}
							min={1}
							step={1}
							onInput={e => props.setTriangleHeightHndlr(+e.currentTarget.value)} />
					</label>
				</>}
			</fieldset>
			<fieldset>
				<legend>Tiles</legend>
				<label>
					On Point
					<input
						type="checkbox"
						checked={props.onPoint}
						onInput={e => props.setOnPointHndlr(e.currentTarget.checked)} />
				</label>
				<label>
					Size (px)
					<span>
						<span>
							{props.radius}
						</span>
						&nbsp;
						<input
							type="range"
							value={props.radius}
							min={1}
							step={1}
							title={props.radius.toString()}
							onInput={e => props.setRadiusHndlr(+e.currentTarget.value)} />
					</span>
				</label>
			</fieldset>
			<fieldset>
				<legend>Map</legend>
				<label>
					Seed
					<input
						type="text"
						value={props.seed}
						onInput={e => props.setSeedHndlr(e.currentTarget.value)} />
				</label>
				<label>
					<span />
					<button onClick={_ => props.randomizeSeedHndlr()}>Randomize</button>
				</label>
			</fieldset>
			<fieldset>
				<legend>Image</legend>
				<label>
					Width (px)
					<input
						type="number"
						value={props.width}
						min={1}
						step={1}
						onInput={e => props.setWidthHndlr(+e.currentTarget.value)} />
				</label>
				<label>
					Height (px)
					<input
						type="number"
						value={props.height}
						min={1}
						step={1}
						onInput={e => props.setHeightHndlr(+e.currentTarget.value)} />
				</label>
			</fieldset>
			<button onClick={props.saveImageHndlr}>Save Image</button>
		</nav>
	);
}

interface SettingsProps extends SetterHndlr<S> {
	textureFiles: Partial<Record<Biome, File>>;
	addTextureImagesHndlr(images: File[]): void;
	removeTextureImagesHndlr(name: Biome): void;
	removeAllTextureImagesHndlr(): void;
	hexagonGridRadius: number;
	setHexagonGridRadiusHndlr(radius: number): void;
	triangleHeight: number;
	setTriangleHeightHndlr(height: number): void;
	randomizeSeedHndlr(): void;
	saveImageHndlr: (() => void) | undefined;
}
