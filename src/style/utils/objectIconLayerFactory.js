const { ICON_SIZE_FACTOR } = require('./constants');

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
module.exports = function objectIconLayerFactory (name, size = 24, { coefMin, coefMax } = { coefMin: 0.85, coefMax: 1 }, source) {
    return {
        id: name,
        type: 'symbol',
        source: 'maps.gruppe-adler.de',
        'source-layer': name,
        layout: {
            'icon-image': `objects/${source || name}`,
            'icon-anchor': 'center',
            'icon-size': [
                "interpolate", ["linear"], ["zoom"],
                4, size * ICON_SIZE_FACTOR * coefMin,
                6, size * ICON_SIZE_FACTOR * coefMax
            ]
        }
    };
}
