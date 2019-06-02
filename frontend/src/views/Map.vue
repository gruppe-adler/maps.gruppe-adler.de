<template>
    <Map :worldName="mapName">
        <template v-slot="{ map, metaData, layer, selectBasemap }">
            <Layers :metaData="metaData" v-model="layer" :select="selectBasemap" />
            <CoordsDisplay :map="map" :metaData="metaData" />
            <Locations :map="map" :metaData="metaData" />
        </template>
    </Map>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

import MapVue from '@/components/Map/Map.vue';
import CoordsDisplayVue from '@/components/Map/CoordsDisplay.vue';
import LayersVue from '@/components/Map/Layers.vue';
import LocationsVue from '@/components/Map/Locations.vue';

@Component({
    components: {
        Map: MapVue,
        Layers: LayersVue,
        CoordsDisplay: CoordsDisplayVue,
        Locations: LocationsVue
    }
})
export default class ReplayVue extends Vue {
    @Prop() private mapName?: string;
}
</script>
