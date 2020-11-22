import * as path from 'path';
import * as fs from 'fs';
import { Layer as MapboxLayer } from 'mapbox-gl';

import fillLayerFactory  from './layerFactories/fill';
import countourLayerFactory  from './layerFactories/countour';
import objectIconLayerFactory  from './layerFactories/objectIcon';
import lineLayerFactory  from './layerFactories/line';
import locationNameLayerFactory  from './layerFactories/locationName';
import locationIconLayerFactory  from './layerFactories/locationIcon';
import { FONT_SIZE_FACTOR } from './constants';

const allLayers: MapboxLayer[] = [
    {
        id: 'background',
        type: 'background',
        paint: {
            'background-color': '#F7F4F1'
        }
    },

    // water
    fillLayerFactory('water', '#77A1D9', 0.5),

    // contours
    countourLayerFactory('contours/100', 500),
    countourLayerFactory('contours/50', 250),
    {
        ...countourLayerFactory('contours/10', 50),
        minzoom: 5,
        maxzoom: 6
    },
    {
        ...countourLayerFactory('contours/05', 25),
        minzoom: 6,
        maxzoom: 7
    },
    {
        ...countourLayerFactory('contours/01', 5),
        minzoom: 7
    },

    // forests / rocks
    fillLayerFactory('forest', '#9FC763', 0.5),
    fillLayerFactory('rocks', '#000000', 0.3),

    // roads
    fillLayerFactory('roads/trail', '#D6C2A6', 0.65),
    {
        id: 'roads/trail-outline',
        type: 'line',
        'source-layer': 'roads/trail',
        paint: {
            'line-opacity': 0.15,
            'line-color': '#D6C2A6'
        }
    },
    fillLayerFactory('roads/track', '#D6C2A6'),
    {
        id: 'roads/track-outline',
        type: 'line',
        'source-layer': 'roads/track',
        paint: {
            'line-opacity': 0.15,
            'line-color': '#D6C2A6'
        }
    },
    fillLayerFactory('roads/road', '#FFFFFF', undefined, { 'fill-outline-color': '#B3B3B3', 'fill-antialias': true }),
    fillLayerFactory('roads/main_road', '#FF9966', undefined, { 'fill-outline-color': '#E6804D', 'fill-antialias': true }),

    // all houses
    fillLayerFactory('house', ['get', 'color']),

    // mounts
    {
        id: 'mount',
        type: 'symbol',
        'source-layer': 'mount',
        layout: {
            'text-field': ['get', 'text'],
            'text-font': ['Roboto Condensed Regular'],
            'text-anchor': 'left',
            'text-size': 0.046 * FONT_SIZE_FACTOR,
            'icon-image': 'mount',
            'icon-size': 0.2,
            'text-offset': [0.5, 0],
            'symbol-sort-key': ['*', ['get', 'elevation'], -1],
            'icon-padding': 150,
            'icon-allow-overlap': true
        },
        paint: {
            'text-color': '#482c18',
            'text-opacity': 0.5
        }
    },

    // runways / power lines / railways
    lineLayerFactory('railway', '#CC3300', 1),
    lineLayerFactory('powerline', '#1A1A1A', 1),
    lineLayerFactory('runway', '#808080', 1),

    // obj with only icons
    {
        ...objectIconLayerFactory('bush', 7, { coefMin: 0.25, coefMax: 4 }, undefined, {
            'icon-allow-overlap': true,
            'icon-ignore-placement': true
        }),
        minzoom: 7
    },
    objectIconLayerFactory('rock', 12, { coefMin: 0.25, coefMax: 4 }, undefined, {
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
    }),
    objectIconLayerFactory('fountain', 11, { coefMin: 0.25, coefMax: 4 }),
    {
        ...objectIconLayerFactory('tree', 12, { coefMin: 0.25, coefMax: 4 }, 'bush', {
            'icon-allow-overlap': true,
            'icon-ignore-placement': true
        }),
        minzoom: 5
    },
    objectIconLayerFactory('tourism', 16, { coefMin: 0.7, coefMax: 4 }),
    objectIconLayerFactory('ruin', 16, { coefMin: 1, coefMax: 4 }),
    objectIconLayerFactory('busstop'),
    objectIconLayerFactory('cross'),
    objectIconLayerFactory('chapel'),
    objectIconLayerFactory('church'),
    objectIconLayerFactory('fuelstation'),
    objectIconLayerFactory('hospital'),
    objectIconLayerFactory('lighthouse'),
    objectIconLayerFactory('power'),
    objectIconLayerFactory('powersolar'),
    objectIconLayerFactory('powerwave'),
    objectIconLayerFactory('powerwind'),
    objectIconLayerFactory('quay'),
    objectIconLayerFactory('shipwreck'),
    objectIconLayerFactory('watertower'),
    objectIconLayerFactory('transmitter'),
    objectIconLayerFactory('bunker', 14, { coefMin: 0.25, coefMax: 4 }),
    objectIconLayerFactory('fortress', 16, { coefMin: 0.25, coefMax: 4 }, 'bunker'),
    objectIconLayerFactory('stack', 16, { coefMin: 0.4, coefMax: 2 }),
    objectIconLayerFactory('view-tower', 16, { coefMin: 0.5, coefMax: 4 }, 'viewtower'),

    // locations
    locationIconLayerFactory({ name: 'locations/respawn_unknown', color: '#000000', opacity: 1, iconSize: 14, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/respawn_inf', color: '#000000', opacity: 1, iconSize: 14, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/respawn_motor', color: '#000000', opacity: 1, iconSize: 14, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/respawn_armor', color: '#000000', opacity: 1, iconSize: 14, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/respawn_air', color: '#000000', opacity: 1, iconSize: 14, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/respawn_plane', color: '#000000', opacity: 1, iconSize: 14, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/respawn_naval', color: '#000000', opacity: 1, iconSize: 14, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/respawn_para', color: '#000000', opacity: 1, iconSize: 14, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/group_0', color: '#000000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/group_1', color: '#000000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/group_2', color: '#000000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/group_3', color: '#000000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/group_4', color: '#000000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/group_5', color: '#000000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/group_6', color: '#000000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/group_7', color: '#000000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/group_8', color: '#000000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/group_9', color: '#000000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/group_10', color: '#000000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/group_11', color: '#000000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_unknown', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_unknown', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_unknown', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_inf', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_inf', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_inf', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_motor_inf', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_motor_inf', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_motor_inf', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_mech_inf', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_mech_inf', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_mech_inf', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_armor', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_armor', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_armor', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_recon', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_recon', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_recon', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_air', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_air', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_air', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_plane', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_plane', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_plane', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_uav', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_uav', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_uav', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_naval', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_naval', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_naval', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_med', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_med', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_med', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_art', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_art', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_art', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_mortar', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_mortar', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_mortar', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_hq', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_hq', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_hq', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_support', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_support', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_support', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_maint', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_maint', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_maint', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_service', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_service', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_service', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_installation', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_installation', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_installation', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/u_installation', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/b_antiair', iconSize: 29, color: '#004D99', opacity: 1, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/o_antiair', color: '#800000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/n_antiair', color: '#008000', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/c_unknown', color: '#660080', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/c_car', color: '#660080', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/c_ship', color: '#660080', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/c_air', color: '#660080', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/c_plane', color: '#660080', opacity: 1, iconSize: 29, fontSize: 0.04 }),
    
    locationIconLayerFactory({ name: 'locations/flag', color: '#000000', opacity: 1, iconSize: 14, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/rockarea', color: '#000000', opacity: 1, iconSize: 12, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/viewpoint', color: '#c7000d', opacity: 1, iconSize: 16, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/hill', color: '#000000', opacity: 1, iconSize: 14, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/bordercrossing', color: '#c7000d', opacity: 1, iconSize: 16, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/vegetationbroadleaf', color: '#406633', opacity: 1, iconSize: 18, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/vegetationfir', color: '#406633', opacity: 1, iconSize: 18, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/vegetationpalm', color: '#406633', opacity: 1, iconSize: 18, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/vegetationvineyard', color: '#406633', opacity: 1, iconSize: 16, fontSize: 0.04 }),
    locationIconLayerFactory({ name: 'locations/handdrawncamp', color: '#000000', opacity: 1, iconSize: 32, fontSize: 0.08 }),

    locationNameLayerFactory('locations/name', 0.04, '#000000'),
    locationNameLayerFactory('locations/faketown', 0.04, '#000000'),
    locationNameLayerFactory('locations/strategic', 0.05, '#406633', 0.7),
    locationNameLayerFactory('locations/strongpointarea', 0.05, '#406633', 0.7),
    locationNameLayerFactory('locations/flatarea', 0.05, '#406633', 0.7),
    locationNameLayerFactory('locations/flatareacity', 0.05, '#406633', 0.7),
    locationNameLayerFactory('locations/flatareacitysmall', 0.05, '#406633', 0.7),
    locationNameLayerFactory('locations/citycenter', 0.05, '#406633', 0),
    locationNameLayerFactory('locations/civildefense', 0.05, '#FFFFFF'),
    locationNameLayerFactory('locations/culturalproperty', 0.05, '#FFFFFF'),
    locationNameLayerFactory('locations/dangerousforces', 0.05, '#FFFFFF'),
    locationNameLayerFactory('locations/safetyzone', 0.05, '#FFFFFF'),
    locationNameLayerFactory('locations/airport', 0.05, '#406633', 0.7),
    locationNameLayerFactory('locations/namemarine', 0.05, '#0D66CC', 0.8),
    locationNameLayerFactory('locations/namelocal', 0.05, '#70614D'),
    locationNameLayerFactory('locations/namevillage', 0.05, '#000000'),
    locationNameLayerFactory('locations/namecity', 0.06, '#000000'),
    locationNameLayerFactory('locations/namecitycapital', 0.07, '#000000'),

    // 'locations/mount',
    // 'locations/invisible',
    // 'locations/historicalsite',
    // 'locations/area',
    
    // 'debug',
];

const outputPath = path.join(__dirname, '..', 'out');
if (!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath);
}

fs.writeFileSync(path.join(outputPath, 'layers.json'), JSON.stringify(allLayers), 'utf8');
