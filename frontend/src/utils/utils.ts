import { ResponseError } from './types';

let API_URI = location.origin;

/**
 * Set maps api uri
 * @param url maps api uri
 */
export const setApiUri = (url: string) => {
    API_URI = url;
};

/**
 * Get maps api uri
 * @returns maps uri
 */
export const getApiUri = (): string => {
    return API_URI;
};


export const relativeUrl = (path: string): string => {
    return `${API_URI}/${path}`;
};

export const fetchJSON = async (input: RequestInfo, init: RequestInit = {}) => {
    let response: Response;

    try {
        response = await fetch(input, init);
    } catch (err) {
        throw err;
    }

    if (!response.ok) throw new ResponseError(response);

    return await response.json();
};
