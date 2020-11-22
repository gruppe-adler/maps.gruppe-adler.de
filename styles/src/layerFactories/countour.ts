import { Layer as MapboxLayer } from 'mapbox-gl';

/**
 * Create MapboxLayer-Object for contours
 * @param {string} name Contour source layer name
 * @param {number} majorStep Major step of contours in m (which lines should display darker)
 * @returns MapboxLayer-Object
 */
export default function countourLayerFactory (name: string, majorStep: number): MapboxLayer {
    return {
        id: name,
        type: 'line',
        'source-layer': name,
        paint: {
            'line-color': [
                'case',
                ['>', ['get', 'dem_elevation'], 0],
                ['rgb', 146, 90, 48],
                ['rgb', 125, 147, 179]
            ],
            'line-opacity': [
                'case',
                ['==', ['%', ['get', 'dem_elevation'], majorStep], 0],
                [
                    'case',
                    ['>', ['get', 'dem_elevation'], 0],
                    0.5,
                    0.6
                ],
                [
                    'case',
                    ['>', ['get', 'dem_elevation'], 0],
                    0.25,
                    0.3
                ]
            ]
        }
    };
}
