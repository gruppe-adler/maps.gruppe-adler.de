interface MapGrid {
    format: string;
    formatX: string;
    formatY: string;
    stepX: number;
    stepY: number;
    zoomMax: number;
}

export default interface MapMetaData {
    author: string;
    displayName: string;
    elevationOffset: number;
    gridOffsetX: number;
    gridOffsetY: number;
    grids: MapGrid[];
    latitude: number;
    longitude: number;
    version: number;
    worldName: string;
    worldSize: number;
}
