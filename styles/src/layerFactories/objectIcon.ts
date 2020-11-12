import { AnyLayout, Layer as MapboxLayer } from 'mapbox-gl';

import { ICON_SIZE_FACTOR } from '../constants';

/**
 * Create MapboxLayer-Object for generic Arma 3 objects
 * @param {string} name Layer name
 * @param {number} [size] Icon size (default: 24)
 * @param options
 * @param {number} options.coefMin 
 * @param {number} options.coefMax 
 * @param {string} [source] Icon sprite name (if it doesn't match name param)
 * @returns MapboxLayer-Object
 */
export default function objectIconLayerFactory (name: string, size = 24, { coefMin, coefMax } = { coefMin: 0.85, coefMax: 1 }, source?: string, layoutOption: AnyLayout = {}): MapboxLayer {
    return {
        id: name,
        type: 'symbol',
        'source-layer': name,
        layout: {
            'icon-image': `objects/${source || name}`,
            'icon-anchor': 'center',
            'icon-size': [
                "interpolate", ["linear"], ["zoom"],
                4, size * ICON_SIZE_FACTOR * coefMin,
                10, size * ICON_SIZE_FACTOR * coefMax
            ],
            ...layoutOption
        }
    };
}
