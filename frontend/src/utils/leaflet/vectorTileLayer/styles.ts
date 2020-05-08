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

interface LocationType {
    drawStyle: 'name'|'icon';
    color: string;
    textSize: number;
};

interface LocationTypeName extends LocationType {
    drawStyle: 'name';
};

interface LocationTypeIcon extends LocationType {
    drawStyle: 'icon';
    size: number;
    texture: string;
};

const TEXT_SIZE_FACTOR = 20;

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

const createText = (x: number, y: number, text: string, style?: string): SVGTextElement => {
    const elem = document.createElementNS(SVG_NAMESPACE, 'text');
    elem.setAttributeNS(null, 'x', `${x}`);
    elem.setAttributeNS(null, 'y', `${y}`);
    elem.setAttributeNS(null, 'dominant-baseline', 'central');
    elem.innerHTML = text;
    
    if (style !== undefined) elem.setAttributeNS(null, 'style', style);

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

const objectIcon = (img: string, size: number = 24): SvgStyle => {
    return (x: number, y: number) => [
        createImg(x, y, size, relativeUrl(`icons/objects/${img}.png`))
    ];
};

const location = (options: LocationTypeIcon|LocationTypeName): SvgStyle => {
    
    type LocationProperties = { angle: number, name: string, radiusA: number, radiusB: number };

    const textStyle = `font-size: ${TEXT_SIZE_FACTOR * options.textSize}em; fill: ${options.color};`;

    switch (options.drawStyle) {
        case 'name':
            // angle, radiusA and radiusB have no effect
            return (x, y, { name }: LocationProperties) => [
                createText(x, y, name, textStyle)
            ];
        case 'icon':
            // radiusA and radiusB have no effect
            return (x, y, { angle, name }: LocationProperties) => {
                const img = createImg(x, y, options.size, relativeUrl(`icons/locations/${options.texture}`));

                if (angle !== 0) img.setAttributeNS(null, 'transform', `rotate(${angle}, ${x}, ${y})`);
                
                if (name.length > 0) {
                    return [
                        img,
                        createText (x + options.size / 2, y, name, textStyle)
                    ];
                }

                return [img];
            }
    }

}

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
        svg: (x, y, { text }: { text: string }) => [
            createText(x, y, text, 'font-size: 0.9em; fill: red;')
        ]
    },

    // locations
    'locations/mount': { svg: () => [] },
    'locations/name': { svg: location({ drawStyle: 'name', color: 'black', textSize: 0.04 }) },
    'locations/strategic': { svg: location({ color: 'rgba(64, 102, 51 0.7)',  textSize: 0.05, drawStyle: 'name' }) },
    'locations/strongpointarea': { svg: location({ color: 'rgba(64, 102, 51 0.7)', textSize: 0.05, drawStyle: 'name' }) },
    'locations/flatarea': { svg: location({ color: 'rgba(64, 102, 51 0.7)', textSize: 0.05, drawStyle: 'name' }) },
    'locations/flatareacity': { svg: location({ color: 'rgba(64, 102, 51 0.7)', textSize: 0.05, drawStyle: 'name' }) },
    'locations/flatareacitysmall': { svg: location({ color: 'rgba(64, 102, 51 0.7)', textSize: 0.05, drawStyle: 'name' }) },
    'locations/citycenter': { svg: () => [] },
    'locations/airport': { svg: location({ color: 'rgba(64, 102, 51 0.7)', textSize: 0.05, drawStyle: 'name' }) },
    'locations/namemarine': { svg: location({ color: 'rgba(13, 102, 204, 0.8)', textSize: 0.05, drawStyle: 'name' }) },
    'locations/namecitycapital': { svg: location({ textSize: 0.07, drawStyle: 'name', color: 'black' }) },
    'locations/namecity': { svg: location({ textSize: 0.06, drawStyle: 'name', color: 'black' }) },
    'locations/namevillage': { svg: location({ textSize: 0.05, drawStyle: 'name', color: 'black' }) },
    'locations/namelocal': { svg: location({ color: '#70614d', textSize: 0.05, drawStyle: 'name' }) },
    'locations/hill': { svg: location({ drawStyle: 'icon', color: 'black', size: 14, textSize: 0.04, texture: 'hill.png' }) },
    'locations/viewpoint': { svg: location({ drawStyle: 'icon', color: '#c6000d', textSize: 0.04, texture: 'viewpoint.png', size: 16 }) },
    'locations/rockarea': { svg: location({ color: 'black', size: 12, texture: 'rockarea.png', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/bordercrossing': { svg: location({ color: '#c6000d', size: 16, texture: 'bordercrossing.png', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/vegetationbroadleaf': { svg: location({ color: '#406633', size: 18, texture: 'vegetationbroadleaf.png', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/vegetationfir': { svg: location({ color: '#406633', size: 18, texture: 'vegetationfir.png', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/vegetationpalm': { svg: location({ color: '#406633', size: 18, texture: 'vegetationpalm.png', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/vegetationvineyard': { svg: location({ color: '#406633', size: 16, texture: 'vegetationvineyard.png', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/faketown': { svg: location({ drawStyle: 'name', color: 'black', textSize: 0.04 }) },
    'locations/area': { svg: () => [] },
    'locations/flag': { svg: location({ drawStyle: 'icon', color: 'black', size: 14, textSize: 0.04, texture: 'hill.png' }) },
    'locations/b_unknown': { svg: location({ texture: 'b_unknown.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_unknown': { svg: location({ texture: 'o_unknown.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_unknown': { svg: location({ texture: 'n_unknown.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_inf': { svg: location({ texture: 'b_inf.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_inf': { svg: location({ texture: 'o_inf.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_inf': { svg: location({ texture: 'n_inf.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_motor_inf': { svg: location({ texture: 'b_motor_inf.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_motor_inf': { svg: location({ texture: 'o_motor_inf.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_motor_inf': { svg: location({ texture: 'n_motor_inf.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_mech_inf': { svg: location({ texture: 'b_mech_inf.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_mech_inf': { svg: location({ texture: 'o_mech_inf.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_mech_inf': { svg: location({ texture: 'n_mech_inf.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_armor': { svg: location({ texture: 'b_armor.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_armor': { svg: location({ texture: 'o_armor.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_armor': { svg: location({ texture: 'n_armor.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_recon': { svg: location({ texture: 'b_recon.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_recon': { svg: location({ texture: 'o_recon.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_recon': { svg: location({ texture: 'n_recon.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_air': { svg: location({ texture: 'b_air.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_air': { svg: location({ texture: 'o_air.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_air': { svg: location({ texture: 'n_air.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_plane': { svg: location({ texture: 'b_plane.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_plane': { svg: location({ texture: 'o_plane.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_plane': { svg: location({ texture: 'n_plane.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_uav': { svg: location({ texture: 'b_uav.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_uav': { svg: location({ texture: 'o_uav.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_uav': { svg: location({ texture: 'n_uav.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_naval': { svg: location({ texture: 'b_naval.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_naval': { svg: location({ texture: 'o_naval.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_naval': { svg: location({ texture: 'n_naval.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_med': { svg: location({ texture: 'b_med.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_med': { svg: location({ texture: 'o_med.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_med': { svg: location({ texture: 'n_med.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_art': { svg: location({ texture: 'b_art.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_art': { svg: location({ texture: 'o_art.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_art': { svg: location({ texture: 'n_art.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_mortar': { svg: location({ texture: 'b_mortar.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_mortar': { svg: location({ texture: 'o_mortar.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_mortar': { svg: location({ texture: 'n_mortar.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_hq': { svg: location({ texture: 'b_hq.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_hq': { svg: location({ texture: 'o_hq.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_hq': { svg: location({ texture: 'n_hq.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_support': { svg: location({ texture: 'b_support.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_support': { svg: location({ texture: 'o_support.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_support': { svg: location({ texture: 'n_support.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_maint': { svg: location({ texture: 'b_maint.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_maint': { svg: location({ texture: 'o_maint.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_maint': { svg: location({ texture: 'n_maint.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_service': { svg: location({ texture: 'b_service.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_service': { svg: location({ texture: 'o_service.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_service': { svg: location({ texture: 'n_service.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_installation': { svg: location({ texture: 'b_installation.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_installation': { svg: location({ texture: 'o_installation.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_installation': { svg: location({ texture: 'n_installation.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/u_installation': { svg: location({ texture: 'u_installation.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/b_antiair': { svg: location({ texture: 'b_antiair.png', size: 29, color: '#004c99', drawStyle: 'icon', textSize: 0.04 }) },
    'locations/o_antiair': { svg: location({ texture: 'o_antiair.png', color: '#7f0000', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/n_antiair': { svg: location({ texture: 'n_antiair.png', color: '#007f00', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/c_unknown': { svg: location({ texture: 'c_unknown.png', color: '#66007f', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/c_car': { svg: location({ texture: 'c_car.png', color: '#66007f', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/c_ship': { svg: location({ texture: 'c_ship.png', color: '#66007f', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/c_air': { svg: location({ texture: 'c_air.png', color: '#66007f', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/c_plane': { svg: location({ texture: 'c_plane.png', color: '#66007f', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/group_0': { svg: location({ texture: 'group_0.png', color: 'black', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/group_1': { svg: location({ texture: 'group_1.png', color: 'black', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/group_2': { svg: location({ texture: 'group_2.png', color: 'black', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/group_3': { svg: location({ texture: 'group_3.png', color: 'black', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/group_4': { svg: location({ texture: 'group_4.png', color: 'black', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/group_5': { svg: location({ texture: 'group_5.png', color: 'black', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/group_6': { svg: location({ texture: 'group_6.png', color: 'black', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/group_7': { svg: location({ texture: 'group_7.png', color: 'black', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/group_8': { svg: location({ texture: 'group_8.png', color: 'black', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/group_9': { svg: location({ texture: 'group_9.png', color: 'black', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/group_10': { svg: location({ texture: 'group_10.png', color: 'black', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/group_11': { svg: location({ texture: 'group_11.png', color: 'black', size: 29, drawStyle: 'icon', textSize: 0.04 }) },
    'locations/respawn_unknown': { svg: location({ texture: 'respawn_unknown.png', color: 'black', drawStyle: 'icon', size: 14, textSize: 0.04 }) },
    'locations/respawn_inf': { svg: location({ texture: 'respawn_inf.png', color: 'black', drawStyle: 'icon', size: 14, textSize: 0.04 }) },
    'locations/respawn_motor': { svg: location({ texture: 'respawn_motor.png', color: 'black', drawStyle: 'icon', size: 14, textSize: 0.04 }) },
    'locations/respawn_armor': { svg: location({ texture: 'respawn_armor.png', color: 'black', drawStyle: 'icon', size: 14, textSize: 0.04 }) },
    'locations/respawn_air': { svg: location({ texture: 'respawn_air.png', color: 'black', drawStyle: 'icon', size: 14, textSize: 0.04 }) },
    'locations/respawn_plane': { svg: location({ texture: 'respawn_plane.png', color: 'black', drawStyle: 'icon', size: 14, textSize: 0.04 }) },
    'locations/respawn_naval': { svg: location({ texture: 'respawn_naval.png', color: 'black', drawStyle: 'icon', size: 14, textSize: 0.04 }) },
    'locations/respawn_para': { svg: location({ texture: 'respawn_para.png', color: 'black', drawStyle: 'icon', size: 14, textSize: 0.04 }) },
    'locations/invisible': { svg: () => [] },
    'locations/historicalsite': { svg: () => [] },
    'locations/civildefense': { svg: location({ color: 'white', textSize: 0.05, drawStyle: 'name' }) },
    'locations/culturalproperty': { svg: location({ color: 'white', textSize: 0.05, drawStyle: 'name' }) },
    'locations/dangerousforces': { svg: location({ color: 'white', textSize: 0.05, drawStyle: 'name' }) },
    'locations/safetyzone': { svg: location({ color: 'white', textSize: 0.05, drawStyle: 'name' } ) },

    // obj with only icons ------------------------------------------------------------------------------------------------
    bunker: { svg: objectIcon('bunker', 14) },
    chapel: { svg: objectIcon('chapel') },
    church: { svg: objectIcon('church') },
    cross: { svg: objectIcon('cross') },
    fuelstation: { svg: objectIcon('fuelstation') },
    lighthouse: { svg: objectIcon('lighthouse') },
    rock: { svg: objectIcon('rock', 12) },
    shipwreck: { svg: objectIcon('shipwreck') },
    transmitter: { svg: objectIcon('transmitter') },
    tree: { svg: objectIcon('bush', 12) },
    bush: { svg: objectIcon('bush', 7) },
    watertower: { svg: objectIcon('watertower') },
    fortress: { svg: objectIcon('bunker', 16) },
    fountain: { svg: objectIcon('fountain', 11) },
    quay: { svg: objectIcon('quay') },
    hospital: { svg: objectIcon('hospital') },
    busstop: { svg: objectIcon('busstop') },
    stack: { svg: objectIcon('stack', 16) },
    ruin: { svg: objectIcon('ruin', 16) },
    tourism: { svg: objectIcon('tourism', 16) },
    power: { svg: objectIcon('power') },
    powersolar: { svg: objectIcon('powersolar') },
    powerwave: { svg: objectIcon('powerwave') },
    powerwind: { svg: objectIcon('powerwind') },
    'view-tower': { svg: objectIcon('viewtower', 16) },

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
    'roads/main_road': {
        canvas: {
            strokeStyle: 'rgba(230, 128, 77, 1)',
            fillStyle: 'rgba(255, 153, 102, 1)',
            lineWidth: 1
        }
    },
    'roads/road': {
        canvas: {
            strokeStyle: 'rgba(179, 179, 179, 1)',
            fillStyle: 'rgba(255, 255, 255, 1)',
            lineWidth: 1
        }
    },
    'roads/track': {
        canvas: {
            strokeStyle: 'rgba(214, 194, 166, 0.25)',
            fillStyle: 'rgba(214, 194, 166, 1)',
            lineWidth: 1
        }
    },
    'roads/trail': {
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
    'contours/01': {
        canvas: contourStyle(5)
    },
    'contours/05': {
        canvas: contourStyle(10)
    },
    'contours/10': {
        canvas: contourStyle(25)
    },
    'contours/50': {
        canvas: contourStyle(100)
    },
    'contours/100': {
        canvas: contourStyle(500)
    },
}

export default styles;