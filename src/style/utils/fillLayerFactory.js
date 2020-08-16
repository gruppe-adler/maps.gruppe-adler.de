/**
 * Create MapboxLayer-Object for normal fill layer
 * @param {string} name Source layer name
 * @param {string|undefined} [color] fill-color paint property
 * @param {number|undefined} [opacity] fill-opacity paint property
 * @param {object} [paintObj] Additional pain properties for layer (default: {})
 * @returns MapboxLayer-Object
 */
module.exports = function fillLayerFactory (name, color, opacity = 1, paintObj = {}) {
    return {
        id: name,
        type: 'fill',
        source: 'maps.gruppe-adler.de',
        'source-layer': name,
        paint: {
            'fill-color': color,
            'fill-opacity': opacity,
            ...paintObj
        }
    };
}
