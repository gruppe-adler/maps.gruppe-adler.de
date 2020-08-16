const { FONT_SIZE_FACTOR, OBJECT_IMAGE_SIZE } = require('./constants');

/**
 * Create MapboxLayer-Object for locations with drawStyle="icon"
 * @param location 
 * @param {string} location.name Source layer name
 * @param {string} location.color Hex Color of text
 * @param {number} location.opacity corresponds with opacity value of "color" property in config
 * @param {number} location.fontSize corresponds with "sizeEx" property in config
 * @param {number} location.iconSize corresponds with "size" property in config
 */
module.exports = function locationIconLayerFactory ({ name, color, opacity, fontSize, iconSize }) {
    return {
        id: name,
        type: 'symbol',
        source: 'maps.gruppe-adler.de',
        'source-layer': name,
        layout: {
            'icon-image': name,
            'icon-allow-overlap': true,
            'icon-anchor': 'center',
            'icon-size': iconSize / OBJECT_IMAGE_SIZE,
            'text-allow-overlap': true,
            'text-field': ['get', 'name'],
            'text-font': ['Roboto Condensed Regular'],
            'text-anchor': 'left',
            'text-size': fontSize * FONT_SIZE_FACTOR,
            'text-offset': [1, 0]
        },
        paint: {
            'text-color': color,
            'text-opacity': opacity
        }
    };
}
