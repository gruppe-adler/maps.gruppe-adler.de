<template>
    <div style="height: 100vh;">

    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

import { Map as LeafletMap, LatLngBounds } from 'leaflet';
import { satTileLayer } from '../utils';

@Component
export default class MapVue extends Vue {
    @Prop({ default: '' }) private mapName!: string;
    private map: LeafletMap|null = null;

    private mounted() {
        this.map = this.setupMap();
        this.setupSatLayer();
    }

    /**
     * This methods sets up the leafelt map.
     */
    private setupMap(): LeafletMap {
        if (this.map) return this.map;

        this.map = new LeafletMap(this.$el as HTMLDivElement, {
            attributionControl: false,
            zoomControl: false,
        });
        this.map.setView([0, 0], 0);
        this.map.setMaxBounds(
            (new LatLngBounds([-90, -180], [90, 180])).pad(0.05)
        );

        return this.map;
    }

    private async setupSatLayer() {
        if (this.map === null) return;

        const layer = await satTileLayer(this.mapName);

        this.map.addLayer(layer);
    }
}
</script>
