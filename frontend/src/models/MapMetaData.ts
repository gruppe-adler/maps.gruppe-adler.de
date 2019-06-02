export interface Layer {
    name: string;
    path: string;
}

export interface Location {
    name: string;
    pos: [number, number];
}

export default interface MapMetaData {
    displayName: string;
    grid: { offsetX: number, offsetY: number };
    layers: Layer[];
    locations: Location[];
    minLod: number;
    maxLod: number;
    worldName: string;
    worldSize: number;
}
