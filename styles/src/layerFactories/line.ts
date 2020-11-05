import { Layer as MapboxLayer } from 'mapbox-gl';

/**
 * Create MapboxLayer-Object for normal line layer
 * @param {string} name Source layer name
 * @param {string|undefined} [color] line-color paint property
 * @param {number|undefined} [opacity] line-width paint property
 * @returns MapboxLayer-Object
 */
export default function lineLayerFactory (name: string, color?: string, width?: number): MapboxLayer {
    return {
        id: name,
        type: 'line',
        'source-layer': name,
        paint: {
            'line-color': color,
            'line-width': width
        }
    };
}
