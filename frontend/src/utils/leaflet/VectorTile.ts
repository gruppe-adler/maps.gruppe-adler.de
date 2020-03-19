import { VectorTile as MapboxVectorTile, VectorTileLayer as MapboxVectorTileLayer, VectorTileFeature } from '@mapbox/vector-tile';
import { Point } from '@mapbox/point-geometry';
import styles, { Style } from './styles';
import pointStyles from './pointStyles';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/**
 * Order of layers. lower index -> top
 */
const LAYERS_ORDER = [
    "NameCity",
    "NameCityCapital",
    "NameLocal",
    "NameVillage",
    "NameMarine",
    "runway",
    "powerline",
    "Hill",
    "fuelstation",
    "chapel",
    "cross",
    "lighthouse",
    "rock",
    "shipwreck",
    "transmitter",
    "watertower",
    "house",
    "main_road",
    "road",
    "track",
    "contours_01",
    "contours_05",
    "contours_10",
    "contours_50",
    "contours_100",
    "water",
];

export class VectorTile {
    private domElement: HTMLDivElement;
    private canvasElement: HTMLCanvasElement;
    private svgElement: SVGSVGElement;
    private width: number;
    private height: number;
    private pointDrawer: ((x: number, y: number, properties: Object) => SVGElement[])|null = null;

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;

        this.domElement = document.createElement('div');
        this.domElement.classList.add('grad-vector-tile');
        
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.width = w;
        this.canvasElement.height = h;
        this.canvasElement.style.cssText = `position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px;`;
        
        this.svgElement = document.createElementNS(SVG_NAMESPACE, 'svg');
        this.svgElement.setAttribute('viewBox', `0 0 ${w} ${h}`);
        this.svgElement.setAttribute('overflow', 'visible');
        this.svgElement.setAttribute('height', `${h}`);
        this.svgElement.setAttribute('width', `${w}`);
        this.svgElement.style.cssText = `position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px;`;

        this.domElement.append(this.canvasElement);
        this.domElement.append(this.svgElement);
    }

    /**
     * Getter for dom element
     */
    public getDomElement(): HTMLElement {
        return this.domElement;
    }

    /**
     * Add contents of mapbox tile to this tile
     * @param tile mapbox tile
     */
    public addMapBoxTile(tile: MapboxVectorTile) {
        const ctx = this.canvasElement.getContext('2d')!;
        ctx.fillStyle = '#FF0000';
        ctx.strokeStyle = '#00FF00';

        const sortedLayers = Object.keys(tile.layers).sort((a, b) => {
            return (LAYERS_ORDER.indexOf(b) - LAYERS_ORDER.indexOf(a));
        });

        for (const layerName of sortedLayers) {
            this.addMapBoxLayer(ctx, tile.layers[layerName]);
        }
    }

    /**
     * Add mapbox layer to tile 
     * @param ctx 2D context of canvas
     * @param layer mapbox layer
     */
    private addMapBoxLayer(ctx: CanvasRenderingContext2D, layer: MapboxVectorTileLayer) {
        const layerName = layer.name;
        const tileSize = layer.extent;

        for (let i = 0; i < layer.length; i++) {
            const feature = layer.feature(i);

            this.set2dContextStyle(ctx, layerName, feature);
            this.pointDrawer = pointStyles[layerName] || null;
            this.drawMapboxFeature(ctx, tileSize, feature);
        }
    }

    private set2dContextStyle(ctx: CanvasRenderingContext2D, layerName: string, feature: VectorTileFeature) {
        let style: Style = {};

        if (styles[layerName] !== undefined) {
            style = styles[layerName](feature.properties);
        }

        // Line styles
        ctx.lineWidth = (style.lineWidth !== undefined) ? style.lineWidth : 1;
        ctx.lineCap = (style.lineCap !== undefined) ? style.lineCap : 'butt';
        ctx.lineJoin = (style.lineJoin !== undefined) ? style.lineJoin : 'miter';
        ctx.miterLimit = (style.miterLimit !== undefined) ? style.miterLimit : 10;
        ctx.setLineDash((style.lineDash !== undefined) ? style.lineDash : []);
        ctx.lineDashOffset = (style.lineDashOffset !== undefined) ? style.lineDashOffset : 0;

        // Text styles
        ctx.font = (style.font !== undefined) ? style.font : '10px sans-serif';
        ctx.textAlign = (style.textAlign !== undefined) ? style.textAlign : 'start';
        ctx.textBaseline = (style.textBaseline !== undefined) ? style.textBaseline : 'alphabetic';
        ctx.direction = (style.direction !== undefined) ? style.direction : 'inherit';

        // Fill and stroke styles
        ctx.fillStyle = (style.fillStyle !== undefined) ? style.fillStyle : '#000';
        ctx.strokeStyle = (style.strokeStyle !== undefined) ? style.strokeStyle : '#000';

        // Shadows
        ctx.shadowBlur = (style.shadowBlur !== undefined) ? style.shadowBlur : 0;
        ctx.shadowColor = (style.shadowColor !== undefined) ? style.shadowColor : 'rgba(0,0,0,0)';
        ctx.shadowOffsetX = (style.shadowOffsetX !== undefined) ? style.shadowOffsetX : 0;
        ctx.shadowOffsetY = (style.shadowOffsetY !== undefined) ? style.shadowOffsetY : 0;

        // Compositing
        ctx.globalAlpha = (style.globalAlpha !== undefined) ? style.globalAlpha : 1;
    }

    /**
     * Draw mapbox feature to tile
     * @param ctx 2D context of canvas
     * @param tileSize mapbox tile size
     * @param feature feature to draw
     */
    private drawMapboxFeature(ctx: CanvasRenderingContext2D, tileSize: number, feature: VectorTileFeature) {
        const geo = feature.loadGeometry();

        switch (VectorTileFeature.types[feature.type]) {
            case 'Point':
                geo.forEach(g => this.drawPoint(g, tileSize, feature.properties));
                break;

            case 'LineString':
                geo.forEach(g => this.drawLine(ctx, g, tileSize));
                break;

            case 'Polygon':
                geo.forEach(g => this.drawPolygon(ctx, g, tileSize));
                break;

            default:
                // TODO: Throw error
                break;
        }
    }

    /**
     * Draw polygon
     * @param ctx canvas 2d context
     * @param points points of polygon
     * @param tileSize mapbox tileSize
     */
    private drawPolygon(ctx: CanvasRenderingContext2D, points: Point[], tileSize: number) {
        ctx.beginPath();
        
        const [start, ...restPoints] = points;
        
        ctx.moveTo(...this.getPointPos(start, tileSize));
        for (const p of restPoints) {
            ctx.lineTo(...this.getPointPos(p, tileSize));
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Draw line
     * @param ctx canvas 2d context
     * @param points points of line
     * @param tileSize mapbox tileSize
     */
    private drawLine(ctx: CanvasRenderingContext2D, points: Point[], tileSize: number) {
        ctx.beginPath();

        const [start, ...restPoints] = points;
        
        ctx.moveTo(...this.getPointPos(start, tileSize));
        for (const p of restPoints) {
            ctx.lineTo(...this.getPointPos(p, tileSize));
        }

        ctx.stroke();
    }

    /**
     * Draw point(s)
     * @param points points of feature
     * @param tileSize mapbox tileSize
     * @param properties props of feature
     */
    private drawPoint(points: Point[], tileSize: number, properties: Object) {

        let func = (x: number, y: number): SVGElement[] => {
            const point = document.createElementNS(SVG_NAMESPACE, 'circle');
            point.setAttributeNS(null, 'cx', `${x}`);
            point.setAttributeNS(null, 'cy', `${y}`);
            point.setAttributeNS(null, 'r', '2');
            point.setAttributeNS(null, 'style', 'fill: red; stroke: blue; stroke-width: 1px;');

            return [point];
        }

        if (this.pointDrawer !== null) {
            func = (x: number, y: number) => this.pointDrawer!(x, y, properties);
        }


        for (const p of points) {
            func( ...this.getPointPos(p, tileSize) ).forEach(e => this.svgElement.appendChild(e));
        }
    }

    /**
     * Get draw pos of mapbox tile pos
     * @param point point to get pos for
     * @param tileSize mapbox tile size
     */
    private getPointPos({ x, y }: Point, tileSize: number): [number, number] {
        return [
            (x / tileSize) * this.width,
            (y / tileSize) * this.height
        ];
    }
}