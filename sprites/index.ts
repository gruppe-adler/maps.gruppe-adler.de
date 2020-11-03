import * as fs from 'fs';
import * as path from 'path';
import glob from 'glob';
import sharp from 'sharp';

interface SpriteJSON {
    [key: string]: {
        height: number,
        pixelRatio: number,
        width: number,
        x: number,
        y: number,
    }
}

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
    const name = pixelRatio === 1 ? 'sprite' : `sprite@${pixelRatio}x`;

    const pngPath = path.resolve(path.join(outputPath, `${name}.png`));
    const jsonPath = path.resolve(path.join(outputPath, `${name}.json`));

    generateLayout(imgs, pixelRatio * 64, pixelRatio).then(({ json, img }) => {
        fs.writeFileSync(pngPath, img);
        fs.writeFileSync(jsonPath, JSON.stringify(json));
    });

}

/**
 * @param {Array<{ path: string, id: string }>} images 
 * @param {number} size Size of sprites
 * @param {number} padding Padding inbetween sprites
 * @param {number} pixelRatio Pixel ratio
 * @return {Promise<{ json: SpriteJSON, img: Buffer }>} 
 */
async function generateLayout(images: Array<{ path: string, id: string }>, size: number, pixelRatio: number, padding = 2): Promise<{ json: SpriteJSON, img: Buffer }> {
    
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
    const overlays: Array<{ top: number, left: number, input: Buffer }> = [];
    const json: SpriteJSON = {};
    
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