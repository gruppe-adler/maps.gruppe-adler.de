const express = require('express');
const cors = require('cors');
const { lstatSync, readdirSync, readFileSync } = require('fs');
const { join } = require('path');

const MAPS_DIR = join(__dirname, 'maps');
let cachedMaps = null;
let cachedMapsDate = null;
const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory);

const app = express();

// cors
app.use(cors({
    credentials: true,
    origin: [
        new RegExp('gruppe-adler\.de$', 'i'),
        new RegExp('localhost:[0-9]+$', 'i'),
        new RegExp('127.0.0.1:[0-9]+$', 'i'),
        new RegExp('127.0.0.1$', 'i'),
        new RegExp('localhost$', 'i')
    ]
}));

app.all('*', (req, res, next) => {
    res.header('Cache-Control', 'max-age=604800');
    next();
});

// Host ./maps directory
app.use(express.static(MAPS_DIR));

// Host ./icons directory
app.use('/icons', express.static(join(__dirname, 'icons')));

// Files which were not found fall through to this handler
app.use('*.png', (req, res, next) => {
    res.sendFile(join(__dirname, 'error.png'));
});

// /maps request
app.get('/maps', (req, res) => {

    if (!cachedMaps) {
        const dirs = getDirectories(MAPS_DIR);

        cachedMaps = dirs.map(dir => {
            const meta = JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf-8'));
    
            return { displayName: meta.displayName, worldName: meta.worldName };
        });

        cachedMapsDate = new Date().toGMTString()
    }

    res.header('Cache-Control', 'no-cache');
    res.header('Last-Modified', cachedMapsDate);
    res.status(200).json(cachedMaps);
});

app.get('/index.html', (req, res) => {
    res.redirect('/preview/');
});

app.get('/', (req, res) => {
    res.redirect('/preview/');
});

app.use('/preview', express.static(join(__dirname, 'preview')));

app.get('/preview/*', (req, res, next) => {
    if (req.accepts('html')) {
        next();
        return;
    } 
    res.sendFile(join(__dirname, 'preview/index.html'));
});

app.listen(80, ()=> console.log('App listening on Port 80'));