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

import { GradMap } from '@gruppe-adler/maps-frontend-utils';

@Component
export default class MapVue extends Vue {
    @Prop({ default: '' }) private mapName!: string;
    private map: GradMap|null = null;

    private mounted() {
        this.map = new GradMap(this.mapName, this.$refs.map as HTMLDivElement);
    }

    /**
     * Toggle sat layer on/off
     */
    private toggleSat() {
        if (this.map === null) return;

        this.map.satShown = !this.map.satShown;
    }

    private toggleGrid() {
        if (this.map === null) return;

        this.map.gridShown = !this.map.gridShown;
        // this.gridShown = this.map.toggleGrid();
    }

    private get satShown(): boolean {
        if (this.map === null) return false;
        return this.map.satShown;
    }

    private get gridShown(): boolean {
        if (this.map === null) return false;
        return this.map.gridShown;
    }

    private get worldSize(): number {
        if (this.map === null) return 0;

        return (this.map.armaMapMetaData || { worldSize: 0 }).worldSize;
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