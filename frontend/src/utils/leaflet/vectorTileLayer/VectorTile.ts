import { VectorTile as MapboxVectorTile, VectorTileLayer as MapboxVectorTileLayer, VectorTileFeature } from '@mapbox/vector-tile';
import { Point } from '@mapbox/point-geometry';
import styles, { CanvasStyle } from './styles';

import LAYERS_ORDER from './layerOrder';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export class VectorTile {
    private domElement: HTMLDivElement;
    private canvasElement: HTMLCanvasElement;
    private svgElement: SVGSVGElement;
    private width: number;
    private height: number;
    private canvasStyler: ((properties: any) => CanvasStyle)|null = null;
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

        this.pointDrawer = null;
        this.canvasStyler = null;

        const layerStyle = styles[layerName];

        if (layerStyle === undefined) {
            console.warn(`Couldn't find style for layer "${layerName}"`);
        } else {
            this.pointDrawer = layerStyle.svg || null;

            if (layerStyle.canvas === undefined) {
                this.set2dContextStyle(ctx, styles.default.canvas);
            } else if (typeof layerStyle.canvas !== 'function') {
                // if layerStyle.canvas is not a function the style is not dependent on any
                // single feature, but constant for the whole layer
                this.set2dContextStyle(ctx, layerStyle.canvas);
            } else {
                this.canvasStyler = layerStyle.canvas;
            }
        }

        for (let i = 0; i < layer.length; i++) {
            const feature = layer.feature(i);
            this.drawMapboxFeature(ctx, tileSize, feature);
        }
    }

    private set2dContextStyle(ctx: CanvasRenderingContext2D, style: CanvasStyle) {
        // Line styles
        ctx.lineWidth = (style.lineWidth !== undefined) ? style.lineWidth : styles.default.canvas.lineWidth;
        ctx.lineCap = (style.lineCap !== undefined) ? style.lineCap  : styles.default.canvas.lineCap;
        ctx.lineJoin = (style.lineJoin !== undefined) ? style.lineJoin :  styles.default.canvas.lineJoin;
        ctx.miterLimit = (style.miterLimit !== undefined) ? style.miterLimit : styles.default.canvas.miterLimit;
        ctx.setLineDash((style.lineDash !== undefined) ? style.lineDash : styles.default.canvas.lineDash);
        ctx.lineDashOffset = (style.lineDashOffset !== undefined) ? style.lineDashOffset : styles.default.canvas.lineDashOffset;

        // Text styles
        ctx.font = (style.font !== undefined) ? style.font : styles.default.canvas.font;
        ctx.textAlign = (style.textAlign !== undefined) ? style.textAlign : styles.default.canvas.textAlign;
        ctx.textBaseline = (style.textBaseline !== undefined) ? style.textBaseline : styles.default.canvas.textBaseline;
        ctx.direction = (style.direction !== undefined) ? style.direction : styles.default.canvas.direction;

        // Fill and stroke styles
        ctx.fillStyle = (style.fillStyle !== undefined) ? style.fillStyle : styles.default.canvas.fillStyle;
        ctx.strokeStyle = (style.strokeStyle !== undefined) ? style.strokeStyle : styles.default.canvas.strokeStyle;

        // Shadows
        ctx.shadowBlur = (style.shadowBlur !== undefined) ? style.shadowBlur : styles.default.canvas.shadowBlur;
        ctx.shadowColor = (style.shadowColor !== undefined) ? style.shadowColor : styles.default.canvas.shadowColor;
        ctx.shadowOffsetX = (style.shadowOffsetX !== undefined) ? style.shadowOffsetX : styles.default.canvas.shadowOffsetX;
        ctx.shadowOffsetY = (style.shadowOffsetY !== undefined) ? style.shadowOffsetY : styles.default.canvas.shadowOffsetY;

        // Compositing
        ctx.globalAlpha = (style.globalAlpha !== undefined) ? style.globalAlpha : styles.default.canvas.globalAlpha;
    }

    /**
     * Draw mapbox feature to tile
     * @param ctx 2D context of canvas
     * @param tileSize mapbox tile size
     * @param feature feature to draw
     */
    private drawMapboxFeature(ctx: CanvasRenderingContext2D, tileSize: number, feature: VectorTileFeature) {
        const geometry = feature.loadGeometry();

        // apply feature dependent canvas style
        if (this.canvasStyler !== null) this.set2dContextStyle(ctx, this.canvasStyler(feature.properties));

        switch (VectorTileFeature.types[feature.type]) {
            case 'Point':
                geometry.forEach(point => this.drawPoint(point, tileSize, feature.properties));
                break;

            case 'LineString':
                geometry.forEach(line => this.drawLine(ctx, line, tileSize));
                break;

            case 'Polygon':
                geometry.forEach(polygon => this.drawPolygon(ctx, polygon, tileSize));
                break;

            default:
                throw new Error(`Feature is not of any known type, instead it is type "${VectorTileFeature.types[feature.type]}"`)
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
        
        const [start, ...remainingPoints] = points;
        
        ctx.moveTo(...this.getPointPos(start, tileSize));
        for (const p of remainingPoints) {
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

        const [start, ...remainingPoints] = points;
        
        ctx.moveTo(...this.getPointPos(start, tileSize));
        for (const p of remainingPoints) {
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

        let func = (this.pointDrawer !== null) ? this.pointDrawer : styles.default.svg;

        for (const p of points) {
            const [x, y] = this.getPointPos(p, tileSize);
            func(x, y, properties).forEach(e => this.svgElement.appendChild(e));
        }
    }

    /**
     * Get draw pos from mapbox tile pos
     * @param point mapbox point to get pos for
     * @param tileSize mapbox tile size
     */
    private getPointPos({ x, y }: Point, tileSize: number): [number, number] {
        return [
            (x / tileSize) * this.width,
            (y / tileSize) * this.height
        ];
    }
}