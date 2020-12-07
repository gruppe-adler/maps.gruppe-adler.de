import { Layer as MapboxLayer } from 'mapbox-gl';
import fillLayerFactory from './fill';

const FACTOR = 0.045;

/**
 * Create MapboxLayer-Object for roads
 * @param {string} type Road type
 * @param {string} color Outline color
 * @param {string} fillColor Fill color
 * @param {number} widthFactor Width factor
 * @returns MapboxLayer-Object
 */
export default function roadLayersFactory(type: string, fillColor: string, outlineColor: string, widthFactor: number): MapboxLayer[] {
    const id = `roads/${type}`

    return [
        {
            'id': id,
            'type': 'line',
            'source-layer': id,
            'paint': {
                'line-color': fillColor,
                'line-width': [
                    'interpolate', 
                    ['exponential', 2], 
                    ['zoom'],
                     0, ['*', ['get', 'width'], FACTOR], 
                    24, ['*', ['get', 'width'], Math.pow(2, 24), FACTOR]
                ]
            }
        },
        {
            'id': `${id}-outline-right`,
            'type': 'line',
            'source-layer': id,
            'paint': {
                'line-color': outlineColor,
                'line-offset': [
                    'interpolate', 
                    ['exponential', 2], 
                    ['zoom'],
                     0, ['*', ['get', 'width'], FACTOR, 0.5], 
                    24, ['*', ['get', 'width'], FACTOR, 0.5, Math.pow(2, 24)]
                ]
            }
        },
        {
            'id': `${id}-outline-left`,
            'type': 'line',
            'source-layer': id,
            'paint': {
                'line-color': outlineColor,
                'line-offset': [
                    'interpolate', 
                    ['exponential', 2], 
                    ['zoom'],
                     0, ['*', ['get', 'width'], FACTOR, -0.5], 
                    24, ['*', ['get', 'width'], FACTOR, -0.5, Math.pow(2, 24)]
                ]
            }
        },
        fillLayerFactory(`${id}-bridge`, fillColor, undefined, { 'fill-outline-color': outlineColor, 'fill-antialias': true }),
    ]
}