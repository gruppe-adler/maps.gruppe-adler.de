import { Layer as MapboxLayer } from 'mapbox-gl';

import { FONT_SIZE_FACTOR, ICON_SIZE_FACTOR } from '../constants';

/**
 * Create MapboxLayer-Object for locations with drawStyle="icon"
 * @param location 
 * @param {string} location.name Source layer name
 * @param {string} location.color Hex Color of text
 * @param {number} location.opacity corresponds with opacity value of "color" property in config
 * @param {number} location.fontSize corresponds with "sizeEx" property in config
 * @param {number} location.iconSize corresponds with "size" property in config
 */
export default function locationIconLayerFactory ({ name, color, opacity, fontSize, iconSize }: { name: string, color: string, opacity: number, fontSize: number , iconSize: number }): MapboxLayer {
    return {
        id: name,
        type: 'symbol',
        'source-layer': name,
        layout: {
            'icon-image': name,
            'icon-anchor': 'center',
            'icon-size': iconSize * ICON_SIZE_FACTOR,
            'text-field': ['get', 'name'],
            'text-font': ['Roboto Condensed Regular'],
            'text-anchor': 'left',
            'text-size': [
                "interpolate", ["linear"], ["zoom"],
                4, fontSize * FONT_SIZE_FACTOR,
                6, fontSize * FONT_SIZE_FACTOR * 2
            ],
            'text-offset': [1, 0]
        },
        paint: {
            'text-color': color,
            'text-opacity': opacity
        }
    };
}
