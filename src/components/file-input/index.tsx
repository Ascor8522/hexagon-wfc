import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import { Biome } from "../../model/biome";
import styles from "./styles.module.css";

export default function FileInput({ images, addTextureImagesHndlr, removeTextureImagesHndlr, removeAllTextureImagesHndlr }: FileInputProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const folderInputRef = useRef<HTMLInputElement>(null);
	const [base64Images, setBase64Images] = useState<{ name: string, objectURL: string; }[]>([]);

	const onChangeFile = useCallback((e: JSX.TargetedEvent<HTMLInputElement>) => {
		const files = e.currentTarget.files;
		if(!files) return;

		addTextureImagesHndlr([...files]);
	}, []);

	const onRemoveImage = useCallback((name: Biome) => () => removeTextureImagesHndlr(name), []);

	useEffect(() => {
		const tuples = Object
			.entries(images)
			.map(([name, file]) => {
				const objectURL = URL.createObjectURL(file);
				return { name, objectURL };
			});
		setBase64Images(tuples);
	}, [images]);

	return (
		<div class={styles.fileInput}>
			<div class={styles.controls}>
				<label>
					<button onClick={() => fileInputRef.current?.click()}>
						Select Images
					</button>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						multiple
						onChange={onChangeFile}
						hidden />
				</label>

				<label>
					<button onClick={() => folderInputRef.current?.click()}>
						Select Folder
					</button>
					<input
						ref={folderInputRef}
						type="file"
						accept="image/*"
						multiple
						{/* @ts-ignore */ ...{}}
						directory=""
						webkitdirectory
						mozdirectory
						msdirectory
						odirectory
						onChange={onChangeFile}
						hidden />
				</label>

				<label>
					<button
						onClick={removeAllTextureImagesHndlr}>
						Remove All
					</button>
				</label>
			</div>
			<div class={styles.previews}>
				{base64Images
					.sort(({ name: a }, { name: b }) => a.localeCompare(b, undefined, { numeric: true }))
					.map(({ name, objectURL }) => <>
						<div key={name}>
							<img src={objectURL} alt={name} />
							<p>{name}</p>
							<button onClick={onRemoveImage(name as Biome)}>X</button>
						</div>
					</>)}
				{!base64Images.length && <>
					<a
						href="/tiles.zip"
						download>
						Download Sample Images
					</a>
				</>}
			</div>
		</div>
	);
}

interface FileInputProps {
	images: Partial<Record<Biome, File>>;
	addTextureImagesHndlr(images: File[]): void;
	removeTextureImagesHndlr(name: Biome): void;
	removeAllTextureImagesHndlr(): void;
}
