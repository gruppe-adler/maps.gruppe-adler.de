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
            opacity: 0.85,
            zIndex: -1,
            bounds: new LatLngBounds([-90, -180], [90, 180])
        }
    ).setZIndex(0);
}

export async function vectorTileLayer(map: string) {
    const { maxzoom, minzoom } = await fetchJSON(relativeUrl(`${map}/mvt/metadata.json`)) as { maxzoom: string, minzoom: string };

    return new VectorTileLayer(
        relativeUrl(`${map}/mvt/{z}/{x}/{y}.pbf`),
        {
            bounds: new LatLngBounds([-90, -180], [90, 180]),
            noWrap: true,
            minNativeZoom: Number.parseInt(minzoom, 10),
            maxNativeZoom: Number.parseInt(maxzoom, 10)
            // tileSize: 4096
        }    
    );
}
