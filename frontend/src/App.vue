<template>
    <router-view></router-view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { setApiUri } from '@gruppe-adler/maps-frontend-utils';
import 'leaflet/dist/leaflet.css';

@Component
export default class AppVue extends Vue {
    private beforeCreate() {
        setApiUri(process.env.NODE_ENV === 'development' ? 'https://maps.gruppe-adler.de' : window.location.origin);
        // setApiUri(window.location.origin);
    }
}
</script>

<style lang="scss">
html, body, #app {
    color: #444;
    font-family: 'Source Sans Pro', sans-serif;
    margin: 0;

    * {
        font-family: 'Source Sans Pro', sans-serif;
    }
}
</style>
