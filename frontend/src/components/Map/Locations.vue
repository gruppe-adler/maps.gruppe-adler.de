<template>
     <md-menu md-size="big" md-direction="bottom-end" class="grad-map-ui__locations">
        <md-button class="md-icon-button md-raised" md-menu-trigger>
            <md-icon>location_on</md-icon>
        </md-button>

        <md-menu-content>
            <md-menu-item v-for="l in locations" :key="l.path" @click="jumpToLocation(l)">
                <md-icon>location_on</md-icon>
                <span class="md-list-item-text">{{l.name}}</span>
            </md-menu-item>
        </md-menu-content>
    </md-menu>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { MapMetaData } from '@/models';
import { Location } from '@/models/MapMetaData';
import { Map } from 'leaflet';
import { armaToLatLng } from '../../MapUtils';

@Component
export default class LocationsVue extends Vue {
    @Prop() private metaData?: MapMetaData;
    @Prop() private map?: Map;

    private jumpToLocation(location: Location) {
        this.map!.flyTo(armaToLatLng(location.pos), 7);
    }

    get locations(): Location[] {
        if (!this.metaData) return [];

        return this.metaData.locations.sort((a, b) => a.name.localeCompare(b.name));
    }
}
</script>

<style lang="scss" scoped>
.grad-map-ui__locations {
    grid-area: locations;
}

</style>
