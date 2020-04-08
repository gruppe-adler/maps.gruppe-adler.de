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

const justIcon = (img: string, size: number = 24): func => {
    return (x: number, y: number) => [
        createImg(x, y, size, relativeUrl(`icons/${img}.png`))
    ];
};

const styles: { [layerName: string]: undefined|func } = {
    hill: (x, y) => {
        const img = createImg(x, y, 16, relativeUrl('icons/hill.png'));

        return [img];
    },
    vegetationbroadleaf: (x, y) => {
        const img = createImg(x, y, 24, relativeUrl('icons/vegetationbroadleaf.png'));

        return [img];
    },
    vegetationvineyard: (x, y) => {
        const img = createImg(x, y, 24, relativeUrl('icons/vegetationvineyard.png'));

        return [img];
    },
    viewpoint: (x, y, attrs) => {
        const img = createImg(x, y, 24, relativeUrl('icons/viewpoint.png'));

        return [img];
    },
    namecity: (x, y, { name }: { name: string }) => {
        const text = createText(x, y, name);

        return [text];
    },
    namecitycapital: (x, y, { name }: { name: string }) => {
        const text = createText(x, y, name);
        text.setAttributeNS(null, 'style', 'font-size: 1.2em; font-weight: bolder; fill: black;');

        return [text];
    },
    namelocal: (x, y, { name }: { name: string }) => {
        const text = createText(x, y, name);
        text.setAttributeNS(null, 'style', 'font-size: 0.9em; fill: #70614c;');

        return [text];
    },
    namevillage: (x, y, { name }: { name: string }) => {
        const text = createText(x, y, name);
        text.setAttributeNS(null, 'style', 'font-size: 0.9em; fill: black;');

        return [text];
    },
    namemarine: (x, y, { name }: { name: string }) => {
        const text = createText(x, y, name);
        text.setAttributeNS(null, 'style', 'font-size: 0.9em; fill: #2f7bd1;');

        return [text];
    },
    airport: (x, y, { name }: { name: string }) => {
        const text = createText(x, y, name);
        text.setAttributeNS(null, 'style', 'font-size: 0.9em; fill: rgb(61,100,46);');

        return [text];
    },
    debug: (x, y, { text }: { text: string }) => {
        const textElem = createText(x, y, text);
        textElem.setAttributeNS(null, 'style', 'font-size: 0.9em; fill: red;');

        return [textElem];
    },
    bunker: justIcon('bunker', 14),
    chapel: justIcon('chapel'),
    church: justIcon('church'),
    cross: justIcon('cross'),
    fuelstation: justIcon('fuelstation'),
    lighthouse: justIcon('lighthouse'),
    rock: justIcon('rock', 12),
    shipwreck: justIcon('shipwreck'),
    transmitter: justIcon('transmitter'),
    tree: justIcon('bush', 12),
    bush: justIcon('bush', 7),
    watertower: justIcon('watertower'),
    fortress: justIcon('fortress', 16),
    fountain: justIcon('fountain', 11),
    quay: justIcon('quay'),
    hospital: justIcon('hospital'),
    busstop: justIcon('busstop'),
    stack: justIcon('stack', 16),
    ruin: justIcon('ruin', 16),
    tourism: justIcon('tourism', 16),
    powersolar: justIcon('powersolar'),
    powerwave: justIcon('powerwave'),
    powerwind: justIcon('powerwind'),
    'view-tower': justIcon('viewtower', 16),
};

export default styles;