declare module '@mapbox/vector-tile' {
    import { Point } from '@mapbox/point-geometry';
    import Protobuf from 'pbf';

    export class VectorTileFeature {
        public type: number;
        public extent: number;
        public id: number;
        public properties: Object;
        public loadGeometry(): Point[][];
        public bbox(): [number, number, number, number];
        public toGeoJSON(x: number, y: number, z: number): unknown;
        public static types: string[];
    }

    export class VectorTileLayer {
        public version: number;
        public name: string;
        public extent: number;
        public length: number;
        public feature(i: number): VectorTileFeature;
    }

    export class VectorTile {
        constructor(protobuf: Protobuf, end?: number);
        public layers: { [layerName: string]: VectorTileLayer };
    }
}

declare module "@mapbox/point-geometry" {
    export interface Point {
        x: number;
        y: number;
    }
}