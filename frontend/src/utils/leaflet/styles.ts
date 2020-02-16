export interface Style {
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

const contourStyle = (properties: { elevation: number }) => {
    const color = (properties.elevation > 0) ? '#decec1' : '#a5bad6';
    
    return {
        strokeStyle: (properties.elevation === 0) ? '#94a9c7' : color,
        lineWidth: .5
    };
}


const styles: { [layerName: string]: (properties: any) => Style } = {
    contours_5: contourStyle,
    contours_10: contourStyle,
    contours_50: contourStyle,
    contours_100: contourStyle,
    roads: (properties: { type: 'track'|'main road'|'road', width: number }) => {
        let strokeStyle: string|undefined = undefined;

        switch (properties.type) {
            case 'track':
                strokeStyle = '#d0ba95';
                break;
            case 'road':
                strokeStyle = '#ffffff';
                break;
            default:
                strokeStyle = '#f79868';
                break;
        }

        return {
            lineWidth: properties.width,
            strokeStyle
        };
    },
    house: ({ color }: { color: string }) => {
        const [r, g, b, a]: [number, number, number, number] = eval(color);

        const fillColor = `rgba(${r}, ${g}, ${b}, ${255 / a})`;

        return {
            strokeStyle: fillColor,
            fillStyle: fillColor
        };
    },
}

export default styles;
