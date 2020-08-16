const fs = require('fs');
const glob = require('glob');
const path = require('path');
const sharp = require('sharp');

const pxRatios = [1, 2, 4];
const inputPath = path.join(__dirname, 'svg');

const outputPath = path.join(__dirname, 'out');
if (!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath);
}

const imgs = glob.sync(path.join(inputPath, '**', '*.svg')).map(filePath => ({
    path: filePath,
    id: path.relative(inputPath, filePath).replace(/\.svg$/i, '')
}));

for (const pixelRatio of pxRatios) {
    const pngPath = path.resolve(path.join(outputPath, `sprite@${pixelRatio}x.png`));
    const jsonPath = path.resolve(path.join(outputPath, `sprite@${pixelRatio}x.json`));

    generateLayout(imgs, pixelRatio * 64, pixelRatio).then(({ json, img }) => {
        fs.writeFileSync(pngPath, img);
        fs.writeFileSync(jsonPath, JSON.stringify(json));
    });

}

/**
 * 
 * @param {Array<{ path: string, id: string }} images 
 * @param {number} size Size of sprites
 * @param {number} padding Padding inbetween sprites
 * @param {number} pixelRatio Pixel ratio
 * @return {Promise<{ json: Object, img: Buffer }>} 
 */
async function generateLayout(images, size, pixelRatio, padding = 2) {
    
    const colsNum = Math.ceil(Math.sqrt(images.length));
    const widthHeight = colsNum * size + (colsNum - 1) * padding;

    const combinedImage = sharp({
        create: {
            width: widthHeight,
            height: widthHeight,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    })

    let col = 0;
    let row = 0;
    const overlays = [];
    const json = {};
    
    for (const image of images) {
        const { data, info } = await sharp(image.path).resize(size, size, { kernel: sharp.kernel.nearest, fit: 'inside' }).toBuffer({ resolveWithObject: true });

        const top = row * (size + padding);
        const left = col * (size + padding);

        overlays.push({ top, left, input: data });

        json[image.id] = { y: top, x: left, width: info.width, height: info.height, pixelRatio };

        col++;
        if (col === colsNum) {
            col = 0;
            row++;
        }
    }

    return {
        json,
        img: await combinedImage.composite(overlays).png().toBuffer()
    };

}