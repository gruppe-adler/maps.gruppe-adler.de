<template>
<div style="height: 100vh;">
    <div ref="map" style="height:100%">
    </div>
    <div v-if="mapNotFound" class="error">
        <h1>Map "{{mapName}}" not found!</h1>
    </div>
    <div v-else-if="error !== null" class="error">
        <h1>An Error occured!</h1>    
    </div>
    <div v-else class="actions">
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

import { GradMap } from '@gruppe-adler/maps-frontend-utils/lib/mapbox';

import GradCursorControl from '@/CursorControl';

@Component
export default class MapVue extends Vue {
    @Prop({ default: '' }) private mapName!: string;
    private map: GradMap|null = null;
    private error: any|null = null;
    private mapNotFound = false;

    private mounted() {
        this.map = new GradMap(this.mapName, { container: this.$refs.map as HTMLDivElement, loadElevation: true });

        this.map.on('grad-load', ({ target }: { target: GradMap }) => {
            target.addControl(new GradCursorControl(), 'top-right');
        });

        this.map.on('error', err => {
            this.error = err;
            console.error(err);
        });

        this.map.on('error:mapnotfound', () => {
            this.mapNotFound = true;
        });
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

.error {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>