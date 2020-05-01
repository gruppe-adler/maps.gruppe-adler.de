import { TileLayer, LatLngBounds, Icon, Marker } from 'leaflet';
import VectorTileLayer from './leaflet/VectorTileLayer';
import { fetchJSON, relativeUrl } from './utils';

export async function satTileLayer(map: string): Promise<TileLayer> {
    const { maxzoom } = await fetchJSON(relativeUrl(`${map}/sat/tile.json`)) as { maxzoom: number };

    return new TileLayer(
        relativeUrl(`${map}/sat/{z}/{x}/{y}.png`),
        {
            maxNativeZoom: maxzoom,
            noWrap: true,
            opacity: 0.85,
            zIndex: -1,
            bounds: new LatLngBounds([-90, -180], [90, 180])
        }
    ).setZIndex(0);
}

export async function vectorTileLayer(map: string): Promise<VectorTileLayer> {
    const { maxzoom, minzoom } = await fetchJSON(relativeUrl(`${map}/mvt/tile.json`)) as { maxzoom: number, minzoom: number };

    return new VectorTileLayer(
        relativeUrl(`${map}/mvt/{z}/{x}/{y}.pbf`),
        {
            bounds: new LatLngBounds([-90, -180], [90, 180]),
            noWrap: true,
            minNativeZoom: minzoom,
            maxNativeZoom: maxzoom,
            // tileSize: 4096
        }    
    );
}
