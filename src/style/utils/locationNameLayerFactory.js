const { FONT_SIZE_FACTOR } = require('./constants');

/**
 * Create MapboxLayer-Object for locations with drawStyle="name"
 * @param {string} name Layer name
 * @param {number} [fontSize] Font size
 * @param {string} [color] "text-color" paint property
 * @param {number} [opacity] "text-opacity" paint property (default = 1)
 * @returns MapboxLayer-Object
 */
module.exports = function locationNameLayerFactory (name, fontSize, color, opacity = 1) {
    return {
        id: name,
        type: 'symbol',
        source: 'maps.gruppe-adler.de',
        'source-layer': name,
        layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Roboto Condensed Regular'],
            'text-anchor': 'left',
            'text-size': fontSize === undefined ? undefined : [
                "interpolate", ["linear"], ["zoom"],
                4, fontSize * FONT_SIZE_FACTOR,
                6, fontSize * FONT_SIZE_FACTOR * 3.5
            ]
        },
        paint: {
            'text-color': color,
            'text-opacity': opacity
        }
    };
}
