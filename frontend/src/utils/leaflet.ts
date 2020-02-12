import { TileLayer, CRS, LatLngBounds, LatLng } from 'leaflet';
import { fetchJSON, relativeUrl } from './utils';

export async function satTileLayer(map: string) {
    const { maxLod } = await fetchJSON(relativeUrl(`${map}/sat/sat.json`)) as { maxLod: number };

    return new TileLayer(
        relativeUrl(`${map}/sat/{z}/{x}/{y}.png`),
        {
            maxNativeZoom: maxLod,
            noWrap: true,
            bounds: new LatLngBounds([-90, -180], [90, 180])
        });
}

// export 