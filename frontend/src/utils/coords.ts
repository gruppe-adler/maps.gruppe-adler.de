/**
 *      We use slightly modified version of the formulas to calculate the pixel coordinates with a specific zoom level of latitude/longitude
 * 
 *      Original Formulas (https://en.m.wikipedia.org/wiki/Web_Mercator_projection#Formulas):
 *          x = (256 / 2π) * 2^z * (longitude + π)
 *          y = (256 / 2π) * 2^z * (π - ln[ tan(π/4 + latitude/2) ])
 *      with
 *          - z = zoom level
 *          - lat/lon are in radians
 *          - (0,0) is in the upper left corner 
 *          - (256,256) in the lower right corner
 * 
 *      Modifications:
 *          - We'll use zoom level 0, because it covers the whole coordinate system
 *          - instead of using 256 as the max size we'll use the worldSize
 *          - instead of the origin (0,0) being in the upper left corner, we want it to be - like in Arma's coordinate system - in the bottom left corner
 * 
 *      So we end up with the following formulas to convert from web mercator latitude/longitude to Arma's coordinate space: 
 *          x = (worldSize / 2π) * (longitude + π)
 *          y = worldSize - (worldSize / 2π) * (π - ln[ tan(π/4 + latitude/2) ])
 * 
 *      To convert from Arma's coordinate space to web mercator you can just solve the formulas for latitude/longitude and end up with the following:
 *          longitude = π * (2x / worldSize - 1)
 *          latitude = 2 * atan(e^(2πy/w - π)) - π/2
 *          
 */

const  rad2deg = (rad: number): number => rad * (180/Math.PI);
const  deg2rad = (deg: number): number => deg * (Math.PI/180);

/**
 * Convert web mercator (EPSG:3857) latitude longitude to Arma coordinates
 * @param {number} worldSize Arma's worldSize in m
 * @param {[number, number]} pos array [latitude, longitude]
 * @returns {[number, number]} Arma position as array [x, y]
 */
export const latLngToArma = (worldSize: number, [lat, lon]: [number, number]): [number, number] => {

    if (worldSize <= 0) throw new Error('worldSize must be larger than 0');

    const x = worldSize / (2 * Math.PI) * (deg2rad(lon) + Math.PI);
    const y = worldSize - (worldSize / (2 * Math.PI)) * (Math.PI - Math.log(Math.tan(Math.PI / 4 + deg2rad(lat) / 2)));

    return [x, y];
};

/**
 * Convert Arma coordinates to web mercator (EPSG:3857) latitude longitude
 * @param {number} worldSize Arma's worldSize in m (must be > 0)
 * @param {[number, number]} pos Arma position as array [x, y]
 * @returns {[number, number]} position in web mercator as array [latitude, longitude]
 */
export const armaToLatLng = (worldSize: number, [x, y]: [number, number]): [number, number] => {

    if (worldSize <= 0) throw new Error('worldSize must be larger than 0');

    const latRad = 2 * Math.atan(Math.pow( Math.E, Math.PI * ((2*y) / worldSize - 1) )) - Math.PI / 2;
    const lonRad = (2 * Math.PI * x) / worldSize - Math.PI;
    
    return [rad2deg(latRad), rad2deg(lonRad)];
};
