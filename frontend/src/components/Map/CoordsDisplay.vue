<template>
    <div class="grad-map-ui__coords md-elevation-2" v-if="coords !== ''">
        <span>{{coords}}</span>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { LatLng, Map, LeafletEvent, LeafletMouseEvent } from 'leaflet';
import { MapMetaData } from '@/models';

@Component
export default class CoordsDisplayVue extends Vue {
    @Prop() private map?: Map;
    @Prop() private metaData?: MapMetaData;
    private coords: string = '';

    private beforeMount() {
        if (!this.map) return;
        this.map.on('mousemove', this.onMouseMove);
    }

    private beforeDestroy() {
        if (!this.map) return;
        this.map.off('mousemove', this.onMouseMove);
    }

    private onMouseMove(event: LeafletEvent) {
        this.updateCoordsString((event as LeafletMouseEvent).latlng);
    }

    private updateCoordsString(coords: LatLng) {

        let x = coords.lng;
        let y = coords.lat;

        if (this.metaData) {
            x += this.metaData.grid.offsetX / 100; // offsetX is from left
            y += (this.metaData.grid.offsetY - this.metaData.worldSize) / 100; // offsetY is from top
        }

        x = Math.floor(x);
        y = Math.floor(y);

        // there are no negative coordinates. -1 = 999
        if (x < 0) x += 1000;
        if (y < 0) y += 1000;

        this.coords = `${x.toString().padStart(3, '0')}  ${y.toString().padStart(3, '0')}`;
    }
}
</script>

<style lang="scss" scoped>
.grad-map-ui__coords {
    grid-area: coords;
    padding: 5px 10px;
    background-color: white;
}
</style>
