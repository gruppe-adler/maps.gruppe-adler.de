<template>
    <div v-if="error">
        <p>Beim Laden der Karten ist etwas schief gelaufen</p>
    </div>
    <div v-else class="maps">
        <h1>Maps:</h1>
        <router-link v-for="map in maps" :key="map.worldName" :to="`/${map.worldName}`">{{map.displayName}}</router-link>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { MapMetaData } from '../models';
import { fetchMaps } from '../ApiUtils';

@Component
export default class ReplayVue extends Vue {
    private maps: MapMetaData[] = [];
    private error: boolean = false;

    private mounted() {
        this.fetchMaps();
    }

    private async fetchMaps() {
        try {
            this.maps = await fetchMaps();
        } catch (err) {
            console.error(err);
            this.error = true;
        }
    }
}
</script>

<style lang="scss">
.maps {
    margin: 10px;
}
.maps > a {
    display: flex;
    margin: 10px;
}
</style>
