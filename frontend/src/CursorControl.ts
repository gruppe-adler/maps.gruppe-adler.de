const CURSOR_DEFAULT = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABHElEQVRYR+1WWw6DMAxzt52CQ8GuOg7VU8CK2jVSgQT6mtik8glJ6gbHscLFj7r4fDQAv9mBsYORuGGAedB4cN9fHSYF3KXcXu9/OdsBCcAbwA3AoDEb7EHYPIrhQPTavV2deQjAJ6xqKbjD7S2l32eCGJc7dp8SuQCKeUIdbQCSOmDJ9GRIk6OcNB3RAChBYnsqCJoO7kIiwRQwnbA9FQdNx0pDihmeimIbXwQgGK/sOtmJXmCcZHPkiu1MEQB/CO2NrFpZSbG3i4ljAQRzWwWg5Yq0RcVl9A0h4nTlcBvWFKK2Df+zA9sxsky2no/zdiRMFFPFknFFjqYjwpTGecKNwu1weM/HOuNgi0o6dG5KYxSsVkwVpSsB0wAsdjSLIftM+zoAAAAASUVORK5CYII=';
const CURSOR_MOVING = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADHUlEQVRYR7WWW0gUURjHfzPqlkqU1kNQdKMbJiGVgt0xapPwoXqMelFIIwi7PFTQc3QxilDDLghJ0ENFbKBZsGYXYtMsUbykUKT5kBUbumxjO3FWR8Zp1zkz4nk+5/v/vv93mVGYwgmUs0o8zz5Cp9swituHQlxJwP83QmLNUw5ee0itm1iuAAxxYL4Q/fGbiO8Ve9xAOAYwi3/s4U9Yw5O92j2EIwCreMkVPIkqjRUnyMxYTJobJ6QBYomHNRqA/EIvydvW88kNhDRAUyW7I/C4tRddZG6IAyHRB4Ve0gXEigWkna7ip7+FXLCfDmkAIVJcQOmdWs6HNd6IzA1xo/sFRPcA9S8+kAnsA57YTYYjgLFgIrMWq7hJKBnIgWh5bI8bANugTi7EBIhuOJVF2cXUOwkW725TFXkRjb5YG/M/AKPbdZ051XWcuf6QK1OBCFSQo6j4NY3QveccsC6rCQAxRu1vWGMX8NItxOsykkPgn51KTqw9MQ4w2ZxP0nBSXGI6tq6ja80S5lohogDTKW4e0U1ZdK1dNhFCmYr4uxvoQmDDYaSmSTixJYvOzGXMM5xQmivJ0HQaElTmBTrgZDmNQ2G8MrabAASHLUTbfTxDg/hUlZ2DQTh6le/RR6X7KcjP5VH6LNT2z/xsaGL5rTp+SBWYURfsAEQzJqXyQIHdwWHCRReY0fuNgXHqKUJMyhpPHNgxwbbpgJhMHGj/r24GxKxk1FOVNL9sZbNMP8SzoLmS3IiCPziMbtguMhficesmIN73UO1vIXXssutFJETOHeLY3Wdc7O1n0Cxu1zgZwFKZT6pks+4E+ozMjTe2oyMZ3PU1RwDiw6KFaN14fPQvyHpEw81MIWtdcfSHRepIA4hPqh7BFxyiraYOr3VPCHFPCj4UNtcFOHP2JpdlCKQBxMYMj9CYlES6dVmZxPOCQ/wpuoTS289emf6RBoi3MQu9hMYyHxW/iEdsOGu3x3PDEYAVouMLv1YupEVV2e5G3G4M45bQvDHFJbfirgHMTug6akkZOLHdnJnjEpgfCyd8b7nd/ZUR2Zpbbf0HPDKkdKLIZkwAAAAASUVORK5CYII=';

import { EventData as MapboxEventData, Map as MapboxMap, MapboxEvent, IControl as MapboxIControl, MapMouseEvent, LngLat as MapboxLngLat } from 'mapbox-gl';

import { GradMap } from '@gruppe-adler/maps-frontend-utils/lib/mapbox';

export default class GradCursorControl implements MapboxIControl {
    private _map: MapboxMap|null = null;
    private _canvas: HTMLCanvasElement|null = null;
    private _control: HTMLDivElement|null = null;
    private _context: CanvasRenderingContext2D|null = null;
    private _mapResizeCallback?: (ev: MapboxEvent & MapboxEventData) => void;
    private _mapRenderCallback?: (ev: MapboxEvent & MapboxEventData) => void;
    private _mapMouseMoveCallback?: (ev: MouseEvent) => void;
    private _mapMouseDownCallback?: (ev: MapMouseEvent & MapboxEventData) => void;
    private _mapMouseUpCallback?: (ev: MapMouseEvent & MapboxEventData) => void;
    private _mapMouseEnterCallback?: (ev: MouseEvent) => void;
    private _mapMouseLeaveCallback?: (ev: MouseEvent) => void;

    private _currentPosition: null|{ x: number, y: number } = null

    constructor () {}

    onAdd (map: MapboxMap): HTMLElement {
        this._map = map;

        this._canvas = document.createElement('canvas');
        this._canvas.classList.add('grad-cursor');
        this._canvas.style.pointerEvents = 'none';
        this._canvas.style.position = 'absolute';
        this._canvas.style.top = '0px';
        this._canvas.style.left = '0px';

        this._context = this._canvas.getContext('2d');

        this._mapResizeCallback = (): void => this.fixWidthHeight();
        this._mapRenderCallback = (): void => this.redraw();
        map.on('resize', this._mapResizeCallback);
        map.on('render', this._mapRenderCallback);

        this._mapMouseDownCallback = (): void => { if (this._context) this._context.strokeStyle = '#CC9900'; };
        this._mapMouseUpCallback = (): void => { if (this._context) this._context.strokeStyle = '#B21A00'; };
        map.on('mouseup', this._mapMouseUpCallback);
        map.on('mousedown', this._mapMouseDownCallback);

        this._mapMouseMoveCallback = event => {
            if (this._canvas === null) return;

            const rect = this._canvas.getBoundingClientRect();
            this._currentPosition = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            this.redraw();
        }
        map.getCanvas().addEventListener('mousemove', this._mapMouseMoveCallback);

        this._mapMouseEnterCallback = this._mapMouseMoveCallback;
        map.getCanvas().addEventListener('mouseenter', this._mapMouseEnterCallback);
        
        this._mapMouseLeaveCallback = () => {
            if (this._context && this._canvas) this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        };
        map.getCanvas().addEventListener('mouseleave', this._mapMouseLeaveCallback);

        const container = map.getCanvasContainer();
        container.appendChild(this._canvas);

        this.fixWidthHeight();

        this._control = document.createElement('div');
        this._control.classList.add('grad-cursor-dummy');
        this._control.style.display = 'none';

        return this._control;
    }
    
    onRemove (): void {
        if (this._canvas !== null) {
            this._canvas.remove();
            this._canvas = null;
        };

        if (this._control !== null) {
            this._control.remove();
            this._control = null;
        };
     
        if (this._map === null) return;

        if (this._mapResizeCallback !== undefined) this._map.off('resize', this._mapResizeCallback);
        if (this._mapRenderCallback !== undefined) this._map.off('render', this._mapRenderCallback);

        if (this._mapMouseUpCallback !== undefined) this._map.off('mouseup', this._mapMouseUpCallback);
        if (this._mapMouseDownCallback !== undefined) this._map.off('mousedown', this._mapMouseDownCallback);
        if (this._mapMouseEnterCallback !== undefined) this._map.getCanvas().removeEventListener('mouseenter', this._mapMouseEnterCallback);
        if (this._mapMouseLeaveCallback !== undefined) this._map.getCanvas().removeEventListener('mouseleave', this._mapMouseLeaveCallback);
        if (this._mapMouseMoveCallback !== undefined) this._map.getCanvas().removeEventListener('mousemove', this._mapMouseMoveCallback);

        this._map = null;
    }

    private fixWidthHeight (): void {
        if (this._map === null || this._canvas === null) return;

        const factor = window.devicePixelRatio;

        const canvas = this._map.getCanvas();
        const { width, height } = canvas.getBoundingClientRect();
        this._canvas.width = width * factor;
        this._canvas.height = height * factor;
        this._canvas.style.height = `${height}px`;
        this._canvas.style.width = `${width}px`;

        if (this._context) this._context.scale(factor, factor);

        this.redraw();
    }

    private redraw (): void {
        if (this._context === null || this._canvas === null || this._map === null || this._currentPosition === null) return;

        if (this._context.strokeStyle === '#000000') {
            this._context.strokeStyle = '#B21A00';
        }
        this._context.fillStyle = '#B21A00';
        this._context.font = '18px monospace';

        const { x, y } = this._currentPosition;

        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        // horizontal line
        this._context.beginPath();
        this._context.moveTo(x, 0);
        this._context.lineTo(x, this._canvas.height);
        this._context.stroke();
        
        // vertical line
        this._context.beginPath();
        this._context.moveTo(0, y);
        this._context.lineTo(this._canvas.width, y);
        this._context.stroke();

        // remove lines around cursor
        this._context.clearRect(x - 21, y - 21, 42, 42);
        
        if (!(this._map instanceof GradMap)) return;
        const map = this._map as GradMap;
        
        const latLng = map.unproject([x, y]);

        let arma: [number, number];
        let grid: string;

        try {
            arma = map.toArma(latLng);
            grid = map.posToGrid(arma);
        } catch (err) {
            return;
        }

        // grid
        this._context.textAlign = 'left';
        this._context.textBaseline = 'bottom';
        this._context.fillText(grid, x + 21, y + 1);

        // elevation
        if (map.loadElevation) {
            const elevation = map.getElevation(latLng);

            if (elevation !== -1) {
                this._context.textBaseline = 'top';
                this._context.fillText(`${Math.round(elevation)} m`, x + 21, y + 2);
            }
        }
    }


    getDefaultPosition (): string {
        return 'top-left';
    }
}
