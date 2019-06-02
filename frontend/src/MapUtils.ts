import { LatLng } from 'leaflet';

const POS_FACTOR = 1 / 100;

export const armaToLatLng = (pos: [number, number]): LatLng => {
    return new LatLng(pos[1] * POS_FACTOR, pos[0] * POS_FACTOR);
};
