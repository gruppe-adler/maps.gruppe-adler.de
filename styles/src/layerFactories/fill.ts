import { FillPaint as MapboxFillPaint, Layer as MapboxLayer, Expression as MapboxExpression } from 'mapbox-gl';

/**
 * Create MapboxLayer-Object for normal fill layer
 * @param {string} name Source layer name
 * @param {string|undefined} [color] fill-color paint property
 * @param {number|undefined} [opacity] fill-opacity paint property
 * @param {object} [paintObj] Additional pain properties for layer (default: {})
 * @returns MapboxLayer-Object
 */
export default function fillLayerFactory (name: string, color?: string|MapboxExpression, opacity = 1, paintObj: MapboxFillPaint = {}): MapboxLayer {
    return {
        id: name,
        type: 'fill',
        'source-layer': name,
        paint: {
            'fill-color': color,
            'fill-opacity': opacity,
            'fill-antialias': false,
            ...paintObj
        }
    };
}
