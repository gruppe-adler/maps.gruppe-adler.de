<template>
<div style="height: 100vh;">
    <div style="height: 100%; background-color: rgba(247, 244, 242, 1);" ref="map">
    </div>
    <div class="actions">
        <button
            @click="toggleGrid"
        >
            <i class="material-icons">{{ gridShown ? 'grid_off' : 'grid_on' }}</i>
        </button>
        <button
            @click="toggleSat"
        >
            <i class="material-icons">{{ satShown ? 'layers_clear' : 'layers' }}</i>
        </button>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

import { Map as LeafletMap, LatLngBounds, TileLayer as LeafletTileLayer } from 'leaflet';
import { satTileLayer } from '../utils';
import { vectorTileLayer } from '@/utils/leaflet';

@Component
export default class MapVue extends Vue {
    @Prop({ default: '' }) private mapName!: string;
    private map: LeafletMap|null = null;
    private satLayer: LeafletTileLayer|null = null;
    private satShown: boolean = true;
    private gridShown: boolean = true;

    private mounted() {
        this.map = this.setupMap();
        this.setupSatLayer();
    }

    /**
     * This methods sets up the leafelt map.
     */
    private setupMap(): LeafletMap {
        if (this.map) return this.map;

        this.map = new LeafletMap(this.$refs.map as HTMLDivElement, {
            attributionControl: false,
            zoomControl: false,
        });
        this.map.setView([0, 0], 0);
        this.map.setMaxBounds(
            (new LatLngBounds([-90, -180], [90, 180])).pad(0.05)
        );

        vectorTileLayer(this.mapName).then(layer => this.map!.addLayer(layer))

        return this.map;
    }

    /**
     * sets up sat layer
     */
    private async setupSatLayer() {
        if (this.map === null) return;

        this.satLayer = await satTileLayer(this.mapName);

        if (this.satShown) this.satLayer.addTo(this.map);
    }

    /**
     * Toggle sat layer on/off
     */
    private toggleSat() {
        this.satShown = !this.satShown;
        
        if (this.map === null || this.satLayer === null) return;

        if (this.satShown) {
            this.satLayer.addTo(this.map);
        } else {
            this.satLayer.removeFrom(this.map);
        }
    }

    private toggleGrid() {
        this.gridShown = !this.gridShown;
        // TODO
    }
}
</script>

<style lang="scss" scoped>
.actions {
    position: absolute;
    margin: 0.5rem;
    top: 0;
    right: 0;
    z-index: 10000;
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: .5rem;

    > button {
        padding: 0.75rem;
        background-color: white;
        border-radius: 50%;
        box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
        cursor: pointer;
        display: flex;
        border: none;
        outline: none;
    }
}
</style>