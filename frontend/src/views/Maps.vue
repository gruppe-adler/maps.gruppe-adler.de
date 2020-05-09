<template>
    <div v-if="loading">
        Loading...
    </div>
    <div v-else-if="error">
        <p>Beim Laden der Karten ist etwas schief gelaufen</p>
    </div>
    <div v-else class="grad-maps">
        <input type="text" placeholder="Search..." v-model="filter" />
        <div class="grad-maps__maps-wrapper">
            <MapItem
                v-for="map in filteredMaps"
                :key="map.worldName"
                :map="map"
                @click.native="goToMap(map)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { fetchMaps } from '@gruppe-adler/maps-frontend-utils';
import { MapMetaData } from '@gruppe-adler/maps-frontend-utils';
import GradMapItemVue from '@/components/Maps/MapItem.vue';

type partialMeta = Pick<MapMetaData, 'worldName'|'displayName'|'author'>;

@Component({
    components: {
        MapItem: GradMapItemVue,
    }
})
export default class MapsVue extends Vue {
    private maps: partialMeta[] = [];
    private error: boolean = false;
    private loading: boolean = false;
    private filter: string = '';

    private mounted() {
        this.fetchMaps();
    }

    private async fetchMaps() {
        this.loading = true;

        try {
            this.maps = await fetchMaps();
        } catch (err) {
            console.error(err);
            this.error = true;
        }

        this.loading = false;
    }

    private get filteredMaps(): partialMeta[] {
        if (this.filter === '') return this.maps;

        const lFilter = this.filter.toLowerCase();

        return this.maps.filter(map => map.displayName.toLowerCase().includes(lFilter));
    }

    private goToMap(map: partialMeta) {
        this.$router.push(`/${map.worldName}`);
    }
}
</script>

<style lang="scss" scoped>
.grad-maps {
    width: 100%;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: 100vh;
    overflow: hidden;
    background-color: #f0eeec;

    > input {
        margin: 1rem;
        padding: 1em;
        font-size: 1.2rem;
        border-radius: .5em;
        border: none;
        background-color: #d6d4d3;
        outline: none;
        transition: all .2s cubic-bezier(.455,.03,.515,.955);

        &:focus {
            background-color: white;
        }
    }

    &__maps-wrapper {
        padding: 1rem;
        display: grid;
        align-content: flex-start;
        justify-items: center;
        flex-shrink: 1;
        overflow-y: auto;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
}
</style>