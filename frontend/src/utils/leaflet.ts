import { TileLayer, LatLngBounds, Icon, Marker } from 'leaflet';
import VectorTileLayer from './leaflet/VectorTileLayer';
import { fetchJSON, relativeUrl } from './utils';

export async function satTileLayer(map: string) {
    const { maxLod } = await fetchJSON(relativeUrl(`${map}/sat/sat.json`)) as { maxLod: number };

    return new TileLayer(
        relativeUrl(`${map}/sat/{z}/{x}/{y}.png`),
        {
            maxNativeZoom: maxLod,
            noWrap: true,
            opacity: 0.8,
            zIndex: -1,
            bounds: new LatLngBounds([-90, -180], [90, 180])
        }
    );
}

export function vectorTileLayer(map: string) {

    return new VectorTileLayer(
        relativeUrl(`${map}/mvt/{z}/{x}/{y}.pbf`),
        {
            bounds: new LatLngBounds([-90, -180], [90, 180]),
            noWrap: true,
            maxNativeZoom: 8, // TODO: read from metadata.json
            // tileSize: 4096
        }    
    );
}
