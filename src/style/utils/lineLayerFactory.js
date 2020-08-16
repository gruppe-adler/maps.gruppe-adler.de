/**
 * Create MapboxLayer-Object for normal line layer
 * @param {string} name Source layer name
 * @param {string|undefined} [color] line-color paint property
 * @param {number|undefined} [opacity] line-width paint property
 * @returns MapboxLayer-Object
 */
module.exports = function lineLayerFactory (name, color, width) {
    return {
        id: name,
        type: 'line',
        source: 'maps.gruppe-adler.de',
        'source-layer': name,
        paint: {
            'line-color': color,
            'line-width': width
        }
    };
}
