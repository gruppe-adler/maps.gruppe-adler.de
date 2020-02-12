<template>
    <div class="grad-map-item">
        <img :src="this.imageUrl" />
        <span class="grad-map-item__name">{{ map.displayName }}</span>
        <span class="grad-map-item__author">- {{ map.author }}</span>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapPreviewImgUrl } from '@/utils';
import { MapMetaData } from '@/utils/types';
import { PropType } from 'vue';

@Component
export default class GradMapItemVue extends Vue {
    @Prop({ required: true, type: Object as PropType<Pick<MapMetaData,'worldName'|'displayName'|'author'>> }) private map!: Pick<MapMetaData,'worldName'|'displayName'|'author'>;

    private get imageUrl(): string {
        return mapPreviewImgUrl(this.map.worldName);
    }
}
</script>

<style lang="scss" scoped>
.grad-map-item {
    font-size: 1.2rem;

    display: inline-grid;
    grid-template-columns: 1fr;
    grid-template-rows: 12em auto auto;
    grid-gap: 0.5em;
    padding: .5em;
    border-radius: 0.25em;
    cursor: pointer;
    transition: background-color 0.1s ease-in-out;

    > img {
        font-size: inherit;
        width: 12em;
        height: 12em;
        max-width: 12em;
        max-width: 12em;
    }

    &__author,
    &__name {
        margin-left: .5rem;
    }

    &__name {
        font-size: 1.5em;
    }

    &__author {
        font-size: 0.75em;
        opacity: 0.75;
    }

    &:hover {
        background-color: rgba(black, 0.05);
    }
}
</style>
