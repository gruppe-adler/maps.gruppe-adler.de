/**
 * Create MapboxLayer-Object for contours
 * @param {string} name Contour source layer name
 * @param {number} majorStep Major step of contours in m (which lines should display darker)
 * @returns MapboxLayer-Object
 */
module.exports = function countourLayerFactory (name, majorStep) {
    return {
        id: name,
        type: 'line',
        source: 'maps.gruppe-adler.de',
        'source-layer': name,
        paint: {
            'line-color': [
                'case',
                ['>', ['get', 'elevation'], 0],
                ['rgb', 146, 90, 48],
                ['rgb', 125, 147, 179]
            ],
            'line-opacity': [
                'case',
                ['==', ['%', ['get', 'elevation'], majorStep], 0],
                [
                    'case',
                    ['>', ['get', 'elevation'], 0],
                    0.5,
                    0.6
                ],
                [
                    'case',
                    ['>', ['get', 'elevation'], 0],
                    0.25,
                    0.3
                ]
            ]
        }
    };
}
