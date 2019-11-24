const  rad2deg = (rad) => rad * (180/Math.PI);

/**
 * Converts arma coordinates to web mercator (EPSG:3857) latitude longitude
 * @param worldSize Arma's worldSize in m
 * @param pos Arma position as array [x, y]
 * @returns array with lon and lat (in this sequence) 
 */
const armaToLonLat = function(worldSize, pos) {
    const x = pos[0];
    const y = worldSize - pos[1];
    
    const ZOOM = 0;
    const w = worldSize;
    
    const lonRad = (2 * Math.PI * x)/(Math.pow(2, ZOOM) * w) - Math.PI;
    
    const exp = ((-2) * Math.PI * y)/(Math.pow(2, ZOOM) * w) + Math.PI;
    const latRad = 2 * Math.atan( Math.pow(Math.E, exp) ) - Math.PI/2;
    
    const lon = rad2deg(lonRad);
    const lat = rad2deg(latRad);

    return [lon, lat];
};


/**
 * Convert GeoJSON geometry with arma coordinates to a matching geometry with
 * web mercator (EPSG:3857) latitude longitude
 * @param worldSize Arma map size in meters
 * @param geo GeoJSON geometry
 */
module.exports = function(worldSize, geo) {

    const convertPos = pos => armaToLonLat(worldSize, pos)

    switch (geo.type) {
        case 'Point':
            geo.coordinates = convertPos(geo.coordinates);
            break;
        case 'LineString':
            geo.coordinates = geo.coordinates.map(convertPos);
            break;
        case 'Polygon':
            geo.coordinates = geo.coordinates.map(a => a.map(convertPos));
            break;
        case 'MultiPoint':
            geo.coordinates = geo.coordinates.map(convertPos);
            break;
        case 'MultiLineString':
            geo.coordinates = geo.coordinates.map(a => a.map(convertPos));
            break;
        case 'MultiPolygon':
            geo.coordinates = geo.coordinates.map(a1 => a1.map(a2 => a2.map(convertPos)));
            break;
    }

    return geo;
}
