const express = require('express');
const cors = require('cors');
const { join } = require('path');

const mapsRouter = require('./mapsRouter');

const app = express();

app.set('case sensitive routing', false);

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

app.get('/', (req, res) => {
    res.redirect('/preview/');
});

app.use('/preview', express.static(join(__dirname, 'preview')));

app.get('/preview/*', (req, res, next) => {
    if (!req.accepts('html')) {
        next();
        return;
    }
    res.sendFile(join(__dirname, 'preview/index.html'));
});

// Host icons directory
app.use('/icons', express.static(join(__dirname, 'icons')));

app.use('/', mapsRouter);

const {
    PORT = 80
} = process.env;

app.listen(PORT, ()=> console.log(`App listening on Port ${PORT}`));