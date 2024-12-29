export enum Biome {
	Desert = "Desert",
	Grassland = "Grassland",
	Forest = "Forest",
	Hills = "Hills",
	Mountains = "Mountains",
	Plains = "Plains",
	Swamp = "Swamp",
	Tundra = "Tundra",
	Water = "Water",
}

export const neighbors: Record<Biome, Biome[]> = ensureBijection({
	[Biome.Desert]: [Biome.Desert, Biome.Plains],
	[Biome.Grassland]: [Biome.Grassland, Biome.Forest, Biome.Plains],
	[Biome.Forest]: [Biome.Forest, Biome.Hills, Biome.Grassland],
	[Biome.Hills]: [Biome.Hills, Biome.Mountains, Biome.Forest],
	[Biome.Mountains]: [Biome.Mountains, Biome.Hills],
	[Biome.Plains]: [Biome.Plains, Biome.Desert, Biome.Grassland],
	[Biome.Swamp]: [Biome.Swamp, Biome.Forest, Biome.Plains],
	[Biome.Tundra]: [Biome.Tundra, Biome.Plains],
	[Biome.Water]: [Biome.Water],
});

export const colors: Record<Biome, string> = {
	[Biome.Desert]: "#f0e68c",
	[Biome.Grassland]: "#7cdc00",
	[Biome.Forest]: "#228b22",
	[Biome.Hills]: "#8b4513",
	[Biome.Mountains]: "#707070",
	[Biome.Plains]: "#f5ffdc",
	[Biome.Swamp]: "#2f6f4f",
	[Biome.Tundra]: "#c3c3c3",
	[Biome.Water]: "#3A75CE",
};

// TODO: let the user specify this
export const textures: Record<Biome, string> = {
	[Biome.Desert]: "/tiles/slice7.png",
	[Biome.Grassland]: "/tiles/slice1.png",
	[Biome.Forest]: "/tiles/slice3.png",
	[Biome.Hills]: "/tiles/slice8.png",
	[Biome.Mountains]: "/tiles/slice6.png",
	[Biome.Plains]: "/tiles/slice2.png",
	[Biome.Swamp]: "/tiles/slice9.png",
	[Biome.Tundra]: "/tiles/slice5.png",
	[Biome.Water]: "/tiles/slice11.png",
};

function ensureBijection<T extends PropertyKey>(obj: Record<T, T[]>): Record<T, T[]> {
	for(const objKey in obj) {
		const arr = obj[objKey];
		for(const val of arr) {
			if(!(val in obj)) obj[val] = [];
			if(obj[val].includes(objKey)) continue;
			obj[val].push(objKey);
			console.warn(`Added ${objKey} to ${String(val)}`);
		}
	}
	return obj;
}
