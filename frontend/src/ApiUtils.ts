import { MapMetaData } from './models';
import rp from 'request-promise';

export const WMTS_BASE_URL = 'https://maps.gruppe-adler.de';

const mapMetaDataCache: { [index: string]: MapMetaData } = {};

export async function fetchMapMetaData(mapName: string): Promise<MapMetaData> {

    // meta data already fetched earlier
    if (mapMetaDataCache[mapName]) {
        return mapMetaDataCache[mapName];
    }

    // make http request
    const res = await rp(`${WMTS_BASE_URL}/${mapName}/meta.json`);

    // parse response if necessary
    if (typeof res === 'string') {
        return JSON.parse(res as string);
    }

    return res;
}

export async function fetchMaps(): Promise<MapMetaData[]> {

    // make http request
    const res = await rp(`${WMTS_BASE_URL}/maps`);

    // parse response if necessary
    if (typeof res === 'string') {
        return JSON.parse(res as string);
    }

    return res;
}
