import { fetchJSON, relativeUrl } from './utils';
import { MapMetaData } from './types';

/**
 * Fetch available maps
 */
export async function fetchMaps(): Promise<Array<Pick<MapMetaData, 'displayName'|'worldName'|'author'>>> {
    return await fetchJSON(relativeUrl('maps'));
}

/**
 * Fetch given map's meta data
 * @param map id of map
 */
export async function fetchMapMetaData(map: string): Promise<MapMetaData> {
    return await fetchJSON(relativeUrl(`${map}/meta.json`));
}

/**
 * Return preview image url of given map
 * @param map id of map
 */
export function mapPreviewImgUrl(map: string): string {
    return relativeUrl(`${map}/preview.png`);
}
