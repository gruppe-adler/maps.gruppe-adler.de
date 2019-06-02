<template>
    <div class="grad-map__wrapper">
        <div class="grad-map" ref="map"></div>
        <md-progress-spinner class="grad-map__loader" v-if="loading" :md-diameter="100" :md-stroke="2" md-mode="indeterminate"></md-progress-spinner>
        <span v-if="error !== ''">{{error}}</span>
        <div class="grad-map-ui" v-if="metaData && map && selectedBasemap">
            <slot :map="map" :metaData="metaData" :layer="selectedBasemap" :selectBasemap="selectBasemap"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { Map, CRS, LatLngBounds } from 'leaflet';
import { WMTS_BASE_URL, fetchMapMetaData } from '@/ApiUtils';
import { MapMetaData, ArmaTileLayer } from '@/models';
import 'leaflet/dist/leaflet.css';
import { Layer } from '@/models/MapMetaData';
import { armaToLatLng } from '@/MapUtils';

@Component
export default class MapVue extends Vue {
    @Prop() private worldName?: string;
    @Prop() private callback?: (map: Map) => any;

    private map: Map|null = null;
    private tileLayer?: ArmaTileLayer;
    private metaData: MapMetaData|null = null;
    private selectedBasemap: Layer|null = null;
    private maxBounds?: LatLngBounds;
    private loading: boolean = true;
    private error: string = '';

    private mounted() {
        this.setupMap();
        this.loadMap();
    }

    private beforeDestroy() {
        if (this.map) this.map.remove();
    }

    /**
     * This methods sets up the leafelt map.
     */
    private setupMap(): Map {
        if (this.map) return this.map;

        this.map = new Map(this.$refs.map as HTMLDivElement, {
            crs: CRS.Simple,
            attributionControl: false,
            zoomControl: false
        });
        this.map.setView([0, 0], 0);


        return this.map;
    }

    private selectBasemap(l: Layer) {
        this.selectedBasemap = l;
    }

    /**
     * This methods handles the map initialization (Adding correct base layer, setting bounds, setting extent etc.)
     */
    @Watch('worldName')
    private async loadMap() {
        if (! this.worldName) return;
        const map = this.map!;

        this.loading = true;

        try {
            this.metaData = await fetchMapMetaData(this.worldName);
        } catch (err) {
            this.loading = false;
            this.error = `Coudln't load meta data for map '${this.worldName}' :(`;
            return;
        }

        this.maxBounds = new LatLngBounds([0, 0], armaToLatLng([this.metaData.worldSize, this.metaData.worldSize]));

        // remove all previos layers
        map.eachLayer(layer => map.removeLayer(layer));

        this.selectedBasemap = this.metaData.layers[0];

        map.fitBounds(this.maxBounds);

        // add a little bit to max bound to let the map not end directly with the last tile
        map.setMaxBounds( this.maxBounds.pad(0.05) );

        this.loading = false;

        if (this.callback) this.callback(map);
    }

    @Watch('selectedBasemap')
    private changeBasemap() {

        if (!this.selectedBasemap) return;
        if (!this.map) return;
        if (!this.metaData) return;

        if (this.tileLayer) this.tileLayer.remove();

        this.tileLayer = new ArmaTileLayer(
            `${WMTS_BASE_URL}/${this.worldName}/${this.selectedBasemap.path}{z}/{x}/{y}.png`,
            this.metaData.worldSize,
            {
                maxNativeZoom: this.metaData.maxLod,
                minNativeZoom: this.metaData.minLod,
                noWrap: true,
                bounds: this.maxBounds
            }
        ).addTo(this.map);
    }

}
</script>

<style lang="scss" scoped>

.grad-map__wrapper {
    overflow: hidden;
    position: relative;
    display: flex;
    z-index: 0;
    height: 100vh;
    width: 100vw;
    align-items: center;
    justify-content: center;
}

.grad-map {
    position: absolute;
    z-index: -1;
    top: 0px;
    right: 0px;
    height: 100vh;
    width: 100vw;
}

.grad-map-ui {
    position: absolute;
    display: grid;
    z-index: 0;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    pointer-events: none;
    justify-items: center;
    align-items: center;
    grid-gap: 10px;
    margin: 10px;
    grid-template-columns: auto 1fr auto auto;
    grid-template-rows: auto auto 1fr;
    grid-template-areas: 
    "title . coords layers"
    ". . . locations"
    ". . . .";

    > * {
        pointer-events: all;
    }
}
</style>
