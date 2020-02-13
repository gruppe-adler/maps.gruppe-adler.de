import { TileLayer, LatLngBounds, Icon, Marker } from 'leaflet';
// @ts-ignore
import VectorTileLayer from 'leaflet-vector-tile-layer';
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

    const contourStyle = (properties: { elevation: number }, zoom: number) => {
        const color = (properties.elevation > 0) ? '#decec1' : '#a5bad6';

        return {
            weight: .5,
            opacity: 1,
            color: (properties.elevation === 0) ? '#94a9c7' : color,
        };
    }

    return new VectorTileLayer(
        relativeUrl(`${map}/mvt/{z}/{x}/{y}.pbf`),
        {
            maxDetailZoom: 8, // TODO: read from metadata.json
            noWrap: true,
            vectorTileLayerStyles: {
                house: ({ color }: { color: string }, zoom: number) => {
                    const [r, g, b, a]: [number, number, number, number] = eval(color);

                    const fillColor = `rgba(${r}, ${g}, ${b}, ${255 / a})`;

                    return {
                        weight: 0,
                        fillOpacity: 1,
                        fillColor
                    };
                },
                contours_5: contourStyle,
                contours_10: contourStyle,
                contours_50: contourStyle,
                contours_100: contourStyle,
                Hill: (properties: any, zoom: number) => {
                    const icon = new Icon({
                        iconUrl: relativeUrl('icons/hill.png')
                    });

                    console.log(properties, icon);
                    return { icon: new Icon.Default() }
                }
            },
            bounds: new LatLngBounds([-90, -180], [90, 180]),
        }
    );
}

export function test(): Marker {
    return new Marker([0, 0], {
        icon: new Icon({
            iconUrl: relativeUrl('icons/hill.png')
        })
    })
}
