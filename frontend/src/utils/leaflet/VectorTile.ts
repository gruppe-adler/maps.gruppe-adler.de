import { DomUtil } from 'leaflet';
import { VectorTile as MapboxVectorTile, VectorTileLayer as MapboxVectorTileLayer, VectorTileFeature } from '@mapbox/vector-tile';
import { Point } from '@mapbox/point-geometry';
import styles, { Style } from './styles';

/**
 * Order of layers. lower index -> top
 */
const LAYERS_ORDER = [
    "house",
    "roads",
    "contours_01",
    "contours_05",
    "contours_10",
    "contours_50",
    "contours_100",
    "water",
];

export class VectorTile {
    private domElement: HTMLCanvasElement;
    private width: number;
    private height: number;

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;

        this.domElement = DomUtil.create('canvas') as HTMLCanvasElement;

        this.domElement.width = this.width;
        this.domElement.height = this.height;
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
        const ctx = this.domElement.getContext('2d')!;
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

            this.setStyle(ctx, layerName, feature);
            this.drawMapboxFeature(ctx, tileSize, feature);
        }
    }

    private setStyle(ctx: CanvasRenderingContext2D, layerName: string, feature: VectorTileFeature) {
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
     * Get draw pos of mapbox tile pos
     * @param point point to get pos for
     * @param tileSize mapbox tile size
     */
    private getPointPos({ x, y }: Point, tileSize: number): [number, number] {
        return [
            (x / tileSize) * this.domElement.width,
            (y / tileSize) * this.domElement.height
        ];
    }
}