<template>
    <md-menu md-size="big" md-direction="bottom-end" class="grad-map-ui__layers">
        <md-button class="md-icon-button md-raised" md-menu-trigger>
            <md-icon>layers</md-icon>
        </md-button>

        <md-menu-content v-if="metaData">
            <md-menu-item v-for="l in metaData.layers" :key="l.path" @click="select(l)">
                <md-avatar>
                    <img :src="pictureUrl(l)" alt="thumbnail">
                </md-avatar>

                <span class="md-list-item-text">{{l.name}}</span>

                <md-icon v-if="value == l" class="md-list-action">check</md-icon>
            </md-menu-item>
        </md-menu-content>
    </md-menu>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { WMTS_BASE_URL, fetchMapMetaData } from '@/ApiUtils';
import { MapMetaData } from '@/models';
import { Layer } from '@/models/MapMetaData';

@Component
export default class LayersVue extends Vue {
    @Prop() private metaData?: MapMetaData;
    @Prop() private value?: Layer;
    @Prop() private select?: (l: Layer) => void;

    private pictureUrl(layer: Layer): string {
        if (!this.metaData) return '';
        return `${WMTS_BASE_URL}/${this.metaData.worldName}/${layer.path}thumbnail.png`;
    }
}
</script>

<style lang="scss" scoped>
.grad-map-ui__layers {
    grid-area: layers;
}
</style>
