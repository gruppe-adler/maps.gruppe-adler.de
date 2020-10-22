const { lstatSync, readdirSync, readFileSync }  = require('fs');
const express  = require('express');
const { join, basename } = require('path');

const allStyleLayers  = require('./style/index');

const mapsRouter = express.Router();
const MAPS_DIR = join(__dirname, '..', 'maps');
const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory);

let cachedMapMetas = new Map();
let cachedMapMetasDate = null;
const mapDirectories = getDirectories(MAPS_DIR);
for (const dir of mapDirectories) {
    const meta = JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf-8'));
    const worldName = meta.worldName.toLowerCase();

    cachedMapMetas.set(worldName, meta);
}

cachedMapsDate = new Date().toGMTString()

// /maps request
mapsRouter.get('/maps', (req, res) => {

    const maps = [];

    for (const map of cachedMapMetas.values()) {
        maps.push({ displayName: map.displayName, worldName: map.worldName, author: map.author })
    }

    res.header('Cache-Control', 'no-cache');
    res.header('Last-Modified', cachedMapMetasDate);
    res.status(200).json(maps);
});

// redirect from map to meta.json
mapsRouter.get('/:map', (req, res, next) => {
    res.redirect(`/${req.params.map}/meta.json`);
});

// check of map exists
mapsRouter.get('/:map/*', (req, res, next) => {
    if (!cachedMapMetas.has(req.params.map.toLowerCase())) {
        res.status(404).send(`Couldn't find map '${req.params.map}'`);
        return;
    }

    req.gradMapMeta = cachedMapMetas.get(req.params.map.toLowerCase());

    next();
});

// meta.json
mapsRouter.get('/:map/meta.json', (req, res, next) => {
    res.json(req.gradMapMeta);
});

// preview.png
mapsRouter.get('/:map/preview.png', (req, res, next) => {
    const worldName = req.gradMapMeta.worldName;

    res.sendFile(join(MAPS_DIR, worldName, 'preview.png'))
});

// redirect from layer to tile.json
mapsRouter.get('/:map/:layer', (req, res, next) => {
    res.redirect(`/${req.params.map}/${req.params.layer}/tile.json`);
});

// sat/mvt tile.json
mapsRouter.get('/:map/:layer/tile.json', (req, res, next) => {
    const worldName = req.gradMapMeta.worldName;
    const layer = req.params.layer.toLowerCase();

    if (!['sat', 'mvt'].includes(layer)) {
        res.status(404).end();
        return;
    }

    const tileJSON = JSON.parse(readFileSync(join(MAPS_DIR, worldName, layer.toLowerCase(), 'tile.json')));

    res.json({
        ...tileJSON,
        tilejson: "2.2.0",
        name: `${req.gradMapMeta.displayName} ${layer === 'sat' ? 'Satellite Tiles' : 'Vector Tiles'}`,
        description: `${layer === 'sat' ? 'Satellite Tiles' : 'Mapbox Vector Tiles'} of the Arma 3 Map '${req.gradMapMeta.displayName}' from ${req.gradMapMeta.author}`,
        attribution: "<a href='https://gruppe-adler.de'>Gruppe Adler</a>",
        scheme: "xyz",
        tiles: [
            `${req.protocol}://${req.get('Host')}/${worldName}/${layer}/{z}/{x}/{y}.${layer === 'sat' ? 'png' : 'pbf'}`
        ]
    })
});

// mvt style.json
mapsRouter.get('/:map/mvt/style.json', (req, res, next) => {
    const worldName = req.gradMapMeta.worldName;

    const tileJSON = JSON.parse(readFileSync(join(MAPS_DIR, worldName, 'mvt', 'tile.json')));
    const mapLayers = tileJSON.vector_layers.map(l => l.id);

    res.json({
        version: 8,
        name: `${req.gradMapMeta.displayName} Vector Tiles`,
        sprite: `${req.protocol}://${req.get('Host')}/sprites/sprite`,
        glyphs: 'https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf',
        sources: {
            [req.get('Host')]: {
                attribution: '<a href="https://www.gruppe-adler.de" target="_blank">Gruppe Adler</a>',
                type: 'vector',
                url: `${req.protocol}://${req.get('Host')}/${worldName}/mvt/tile.json`
            }
        },
        layers: allStyleLayers.filter(l => (mapLayers.includes(l['source-layer']) || l.id === 'background')).map(l => ({ ...l, source: req.get('Host') }))
    })
});

// add Content-Encoding: gzip for pbf files
mapsRouter.get('*.pbf', (req, res, next) => {
    res.header('Content-Encoding', 'gzip');
    next();
});

// Host tiles
for (const mapDir of mapDirectories) {
    const worldName = basename(mapDir);
    for (layerDir of getDirectories(mapDir)) {
        mapsRouter.use(`/${worldName}/${basename(layerDir)}`, express.static(layerDir))
    }
}


module.exports = mapsRouter;
