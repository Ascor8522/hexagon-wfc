export enum Biome {
	Desert = "Desert",
	Grassland = "Grassland",
	Forest = "Forest",
	Dark_Forest = "Dark Forest",
	Hills = "Hills",
	Mountains = "Mountains",
	Plains = "Plains",
	Swamp = "Swamp",
	Tundra = "Tundra",
	Water = "Water",
}

export const neighbors: Record<Biome, Biome[]> = ensureBijection({
	[Biome.Desert]: [Biome.Desert, Biome.Plains, Biome.Mountains],
	[Biome.Grassland]: [Biome.Grassland, Biome.Forest, Biome.Plains, Biome.Swamp, Biome.Water],
	[Biome.Forest]: [Biome.Forest, Biome.Hills, Biome.Grassland, Biome.Swamp, Biome.Plains, Biome.Dark_Forest],
	[Biome.Dark_Forest]: [Biome.Dark_Forest, Biome.Forest],
	[Biome.Hills]: [Biome.Hills, Biome.Mountains, Biome.Forest],
	[Biome.Mountains]: [Biome.Mountains, Biome.Hills, Biome.Water, Biome.Desert],
	[Biome.Plains]: [Biome.Plains, Biome.Desert, Biome.Grassland, Biome.Tundra, Biome.Forest],
	[Biome.Swamp]: [Biome.Swamp, Biome.Forest, Biome.Water, Biome.Grassland],
	[Biome.Tundra]: [Biome.Tundra, Biome.Plains],
	[Biome.Water]: [Biome.Water, Biome.Swamp, Biome.Mountains, Biome.Grassland],
});

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
