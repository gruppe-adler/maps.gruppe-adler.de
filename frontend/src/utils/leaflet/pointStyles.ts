import { relativeUrl } from '../utils';

type func = (x: number, y: number, properties: any) => SVGElement[];

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

const createText = (x: number, y: number, text: string): SVGTextElement => {
    const elem = document.createElementNS(SVG_NAMESPACE, 'text');
    elem.setAttributeNS(null, 'x', `${x}`);
    elem.setAttributeNS(null, 'y', `${y}`);
    elem.innerHTML = text;

    return elem;
}

const createImg = (x: number, y: number, size: number, href: string) => {
    const img = document.createElementNS(SVG_NAMESPACE, 'image');

    img.setAttributeNS(null, 'x', `${x - size/2}`);
    img.setAttributeNS(null, 'y', `${y - size/2}`);
    img.setAttributeNS(null, 'width', `${size}`);
    img.setAttributeNS(null, 'height', `${size}`);
    img.setAttributeNS(null, 'href', href);

    return img;
};

const styles: { [layerName: string]: undefined|func } = {
    Hill: (x, y) => {
        const img = createImg(x, y, 16, relativeUrl('icons/hill.png'));

        return [img];
    },
    tree: (x, y) => {
        const img = createImg(x, y, 24, relativeUrl('icons/bush.png'));

        return [img];
    },
    NameCity: (x, y, { name }: { name: string }) => {
        const text = createText(x, y, name);

        return [text];
    },
    NameCityCapital: (x, y, { name }: { name: string }) => {
        const text = createText(x, y, name);
        text.setAttributeNS(null, 'style', 'font-size: 1.2em; font-weight: bolder; fill: black;');

        return [text];
    },
    NameLocal: (x, y, { name }: { name: string }) => {
        const text = createText(x, y, name);
        text.setAttributeNS(null, 'style', 'font-size: 0.9em; fill: #70614c;');

        return [text];
    },
    NameVillage: (x, y, { name }: { name: string }) => {
        const text = createText(x, y, name);
        text.setAttributeNS(null, 'style', 'font-size: 0.9em; fill: black;');

        return [text];
    },
    NameMarine: (x, y, { name }: { name: string }) => {
        const text = createText(x, y, name);
        text.setAttributeNS(null, 'style', 'font-size: 0.9em; fill: #2f7bd1;');

        return [text];
    }
};

export default styles;