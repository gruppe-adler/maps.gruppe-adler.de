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

/*
colorCountlines             rgba(146, 90, 48, 0.25)
colorCountlinesWater        rgba(125, 147, 179, 0.3)
colorMainCountlines         rgba(146, 90, 48, 0.5)
colorMainCountlinesWater    rgba(125, 147, 179, 0.6)
*/
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



const styles: { [layerName: string]: (properties: any) => Style } = {
    contours_01: contourStyle(5),
    contours_05: contourStyle(10),
    contours_10: contourStyle(25),
    contours_50: contourStyle(100),
    contours_100: contourStyle(500),
    main_road: () => ({
        strokeStyle: 'rgba(230, 128, 77, 1)',
        fillStyle: 'rgba(255, 153, 102, 1)',
        lineWidth: 1
    }),
    road: () => ({
        strokeStyle: 'rgba(179, 179, 179, 1)',
        fillStyle: 'rgba(255, 255, 255, 1)',
        lineWidth: 1
    }),
    track: () => ({
        strokeStyle: 'rgba(214, 194, 166, 0.25)',
        fillStyle: 'rgba(214, 194, 166, 1)',
        lineWidth: 1
    }),
    trail: () => ({
        strokeStyle: 'rgba(214, 194, 166, 0.15)',
        fillStyle: 'rgba(214, 194, 166, 0.65)',
        lineWidth: 1
    }),
    runway: () => ({
        strokeStyle: 'rgba(128, 128, 128, 1)',
        fillStyle: 'transparent',
        lineWidth: 1
    }),
    powerline: () => ({
        strokeStyle: 'rgba(0, 0, 0, 1)',
        lineWidth: 1
    }),
    railway: () => ({
        // colorRailWay[] = {0.8,0.2,0,1};
        strokeStyle: 'rgb(204, 51, 0)',
        lineWidth: 1
    }),
    house: ({ color }: { color: string }) => {
        const [r, g, b, a]: [number, number, number, number] = eval(color);

        const fillColor = `rgba(${r}, ${g}, ${b}, ${255 / a})`;

        return {
            strokeStyle: fillColor,
            fillStyle: fillColor
        };
    },
    water: () => {
        return {
            strokeStyle: 'transparent',
            fillStyle: 'transparent'
            // fillStyle: 'rgba(119, 161, 217, 0.5)'
        }
    }
}

export default styles;