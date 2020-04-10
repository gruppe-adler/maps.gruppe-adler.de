import { relativeUrl } from '../../utils';

export interface CanvasStyle {
    // Line styles
    lineWidth?: number;
    lineCap?: 'butt'|'round'|'square';
    lineJoin?: 'round'|'bevel'|'miter';
    miterLimit?: number;
    lineDash?: number[];
    lineDashOffset?: number;

    // Text styles
    font?: string;
    textAlign?: 'start'|'end'|'left'|'right'|'center';
    textBaseline?: 'top'|'hanging'|'middle'|'alphabetic'|'ideographic'|'bottom';
    direction?: 'ltr'|'rtl'|'inherit';

    // Fill and stroke styles
    fillStyle?: string | CanvasGradient | CanvasPattern;
    strokeStyle?: string | CanvasGradient | CanvasPattern;

    // Shadows
    shadowBlur?: number;
    shadowColor?: string;
    shadowOffsetX?: number;
    shadowOffsetY?: number;

    // Compositing
    globalAlpha?: number;
}
type SvgStyle = (x: number, y: number, properties: any) => SVGElement[];


const contourStyle = (majorStep: number) => {
    return ({ elevation }: { elevation: number }) => {
        let strokeStyle: string;

        if (elevation % majorStep === 0) {
            strokeStyle = (elevation > 0) ? 'rgba(146, 90, 48, 0.5)' : 'rgba(125, 147, 179, 0.6)';
        } else {
            strokeStyle = (elevation > 0) ? 'rgba(146, 90, 48, 0.25)' : 'rgba(125, 147, 179, 0.3)';
        }

        return {
            strokeStyle,
            lineWidth: 1
        };
    }
}


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

const justIcon = (img: string, size: number = 24): SvgStyle => {
    return (x: number, y: number) => [
        createImg(x, y, size, relativeUrl(`icons/${img}.png`))
    ];
};

const styles: {
    [layerName: string]: undefined|{
        canvas?: CanvasStyle|((properties: any) => CanvasStyle),
        svg?: SvgStyle
    },
    default: {
        svg: SvgStyle,
        canvas: {
            // Line styles
            lineWidth: number,
            lineCap: 'butt'|'round'|'square',
            lineJoin: 'round'|'bevel'|'miter',
            miterLimit: number,
            lineDash: number[],
            lineDashOffset: number,
        
            // Text styles
            font: string,
            textAlign: 'start'|'end'|'left'|'right'|'center',
            textBaseline: 'top'|'hanging'|'middle'|'alphabetic'|'ideographic'|'bottom',
            direction: 'ltr'|'rtl'|'inherit',
        
            // Fill and stroke styles
            fillStyle: string | CanvasGradient | CanvasPattern,
            strokeStyle: string | CanvasGradient | CanvasPattern,
        
            // Shadows
            shadowBlur: number,
            shadowColor: string,
            shadowOffsetX: number,
            shadowOffsetY: number,
        
            // Compositing
            globalAlpha: number
        }
    }
} = {
    default: {
        canvas: {
            // Line styles
            lineWidth: 1,
            lineCap: 'butt',
            lineJoin: 'miter',
            miterLimit: 10,
            lineDash: [],
            lineDashOffset: 0,

            // Text styles
            font: '10px sans-serif',
            textAlign: 'start',
            textBaseline: 'alphabetic',
            direction: 'inherit',

            // Fill and stroke styles
            fillStyle: '#000',
            strokeStyle: '#000',

            // Shadows
            shadowBlur: 0,
            shadowColor: 'rgba(0,0,0,0)',
            shadowOffsetX: 0,
            shadowOffsetY: 0,

            // Compositing
            globalAlpha: 1
        },
        svg: (x: number, y: number): SVGElement[] => {
            const point = document.createElementNS(SVG_NAMESPACE, 'circle');
            point.setAttributeNS(null, 'cx', `${x}`);
            point.setAttributeNS(null, 'cy', `${y}`);
            point.setAttributeNS(null, 'r', '2');
            point.setAttributeNS(null, 'style', 'fill: red; stroke: blue; stroke-width: 1px;');

            return [point];
        }
    },
    debug: {
        svg: (x, y, { text }: { text: string }) => {
            const textElem = createText(x, y, text);
            textElem.setAttributeNS(null, 'style', 'font-size: 0.9em; fill: red;');

            return [textElem];
        }
    },
    
    // obj with only icons ------------------------------------------------------------------------------------------------
    bunker: {
        svg: justIcon('bunker', 14)
    },
    chapel: {
        svg: justIcon('chapel')
    },
    church: {
        svg: justIcon('church')
    },
    cross: {
        svg: justIcon('cross')
    },
    fuelstation: {
        svg: justIcon('fuelstation')
    },
    lighthouse: {
        svg: justIcon('lighthouse')
    },
    rock: {
        svg: justIcon('rock', 12)
    },
    shipwreck: {
        svg: justIcon('shipwreck')
    },
    transmitter: {
        svg: justIcon('transmitter')
    },
    tree: {
        svg: justIcon('bush', 12)
    },
    bush: {
        svg: justIcon('bush', 7)
    },
    watertower: {
        svg: justIcon('watertower')
    },
    fortress: {
        svg: justIcon('fortress', 16)
    },
    fountain: {
        svg: justIcon('fountain', 11)
    },
    quay: {
        svg: justIcon('quay')
    },
    hospital: {
        svg: justIcon('hospital')
    },
    busstop: {
        svg: justIcon('busstop')
    },
    stack: {
        svg: justIcon('stack', 16)
    },
    ruin: {
        svg: justIcon('ruin', 16)
    },
    tourism: {
        svg: justIcon('tourism', 16)
    },
    powersolar: {
        svg: justIcon('powersolar')
    },
    powerwave: {
        svg: justIcon('powerwave')
    },
    powerwind: {
        svg: justIcon('powerwind')
    },
    'view-tower': {
        svg: justIcon('viewtower', 16)
    },

    // runways / power lines / railways ----------------------------------------------------------------
    runway: {
        canvas: {
            strokeStyle: 'rgba(128, 128, 128, 1)',
            fillStyle: 'transparent',
            lineWidth: 1
        }
    },
    powerline: {
        canvas: {
            strokeStyle: 'rgba(0, 0, 0, 1)',
            lineWidth: 1
        }
    },
    railway: {
        canvas: {
            strokeStyle: 'rgb(204, 51, 0)',
            lineWidth: 1
        }
    },

    // all houses -------------------------------------------------------------------------------------------
    house: {
        canvas: ({ color }: { color: string }) => {
            const [r, g, b, a]: [number, number, number, number] = eval(color);

            const fillColor = `rgba(${r}, ${g}, ${b}, ${255 / a})`;

            return {
                strokeStyle: fillColor,
                fillStyle: fillColor
            };
        }
    },

    // roads -------------------------------------------------------------------------------------
    main_road: {
        canvas: {
            strokeStyle: 'rgba(230, 128, 77, 1)',
            fillStyle: 'rgba(255, 153, 102, 1)',
            lineWidth: 1
        }
    },
    road: {
        canvas: {
            strokeStyle: 'rgba(179, 179, 179, 1)',
            fillStyle: 'rgba(255, 255, 255, 1)',
            lineWidth: 1
        }
    },
    track: {
        canvas: {
            strokeStyle: 'rgba(214, 194, 166, 0.25)',
            fillStyle: 'rgba(214, 194, 166, 1)',
            lineWidth: 1
        }
    },
    trail: {
        canvas: {
            strokeStyle: 'rgba(214, 194, 166, 0.15)',
            fillStyle: 'rgba(214, 194, 166, 0.65)',
            lineWidth: 1
        }
    },

    // forests / water / rocks ------------------------------------------------------------------------------------------------
    water: {
        canvas: {
            strokeStyle: 'transparent',
            fillStyle: 'transparent'
        }
    },
    forest: {
        canvas: {
            fillStyle: 'rgba(159, 199, 99, 0.5)',
            strokeStyle: 'rgba(159, 199, 99, 0.5)'
        }
    },
    rocks: {
        canvas: {
            fillStyle: 'rgba(0, 0, 0, 0.3)',
            strokeStyle: 'rgba(0, 0, 0, 0.3)'
        }
    },

    // contours ------------------------------------------------------------------------------------------------
    contours_01: {
        canvas: contourStyle(5)
    },
    contours_05: {
        canvas: contourStyle(10)
    },
    contours_10: {
        canvas: contourStyle(25)
    },
    contours_50: {
        canvas: contourStyle(100)
    },
    contours_100: {
        canvas: contourStyle(500)
    },
}

export default styles;