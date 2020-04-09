import {
    Map as LeafletMap,
    MapOptions as LeafletMapOptions,
    TileLayer as LeafletTileLayer,
    LatLngBounds
} from 'leaflet';
import { satTileLayer, vectorTileLayer, MapMetaData } from '..';
import { fetchMapMetaData } from '../api';

export default class GradMap extends LeafletMap {
    private _armaMapName: string;
    private _armaMapMetaData: MapMetaData|null = null;

    private _satShown: boolean = false;
    private _gridShown: boolean = true;
    private _initializationDone: boolean = false;

    private _satLayer: LeafletTileLayer|null = null;

    constructor(map: string, element: string | HTMLElement, options: LeafletMapOptions & { satShown?: boolean, gridShown?: boolean } = {}) {
        super(element, {
            attributionControl: false,
            zoomControl: false,
            // maxBounds: (new LatLngBounds([-90, -180], [90, 180])).pad(0.05),
            center: [0, 0],
            zoom: 0,
            ...options
        });

        this._armaMapName = map;
        if (options.satShown !== undefined) this._satShown = options.satShown;
        if (options.gridShown !== undefined) this._gridShown = options.gridShown;

        this.gradInitialize();
    }

    private async gradInitialize(): Promise<void> {
        const prom1 = vectorTileLayer(this._armaMapName).then(layer => layer.addTo(this));
        const prom2 = satTileLayer(this._armaMapName).then(layer => {
            this._satLayer = layer;

            if (this.satShown) layer.addTo(this);
        });
        const prom3 = fetchMapMetaData(this._armaMapName).then(data => this._armaMapMetaData = data);

        await Promise.all([prom1, prom2, prom3]);

        this._initializationDone = true;
    }

    public set satShown(value: boolean) {
        this._satShown = value;
        
        if (this._satLayer === null) return;

        if (this._satShown) {
            this._satLayer.addTo(this);
        } else {
            this._satLayer.removeFrom(this);
        }
    }
    public get satShown(): boolean {
        return this._satShown;
    }

    public set gridShown(value: boolean) {
        this._gridShown = value;
        
        // TODO: Hide / show grid
    }
    public get gridShown(): boolean {
        return this._gridShown;
    }

    public get initializationDone(): boolean {
        return this._initializationDone;
    }

    public get armaMapMetaData(): MapMetaData|null {
        return this._armaMapMetaData;
    }
}