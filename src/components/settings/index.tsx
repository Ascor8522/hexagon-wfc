import { GridShape } from "../../draw";
import styles from "./styles.module.css";

export default function Settings(props: SettingsProps) {
	return (
		<nav style={styles}>
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
									{mode}
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
							value={props.radius}
							min={1}
							step={1}
							onInput={e => props.setRadiusHndlr(+e.currentTarget.value)} />
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
						{props.hexSize}
						&nbsp;
						<input
							type="range"
							value={props.hexSize}
							min={1}
							step={1}
							title={props.hexSize.toString()}
							onInput={e => props.setHexSizeHndlr(+e.currentTarget.value)} />
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

interface SettingsProps {
	shape: GridShape;
	rows: number;
	cols: number;
	radius: number;
	triangleHeight: number;
	onPoint: boolean;
	hexSize: number;
	seed: string;
	width: number;
	height: number;
	setShapeHndlr(shape: GridShape): void;
	setRowsHndlr(rows: number): void;
	setColsHndlr(cols: number): void;
	setRadiusHndlr(radius: number): void;
	setTriangleHeightHndlr(height: number): void;
	setOnPointHndlr(onPoint: boolean): void;
	setHexSizeHndlr(hexSize: number): void;
	setSeedHndlr(seed: string): void;
	randomizeSeedHndlr(): void;
	setWidthHndlr(width: number): void;
	setHeightHndlr(height: number): void;
	saveImageHndlr(): void;
}
