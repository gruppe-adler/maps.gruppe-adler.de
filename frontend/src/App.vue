<template>
    <router-view></router-view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { setApiUri } from '@/utils';
import 'leaflet/dist/leaflet.css';

@Component
export default class AppVue extends Vue {
    private beforeCreate() {
        setApiUri('http://zade.gruppe-adler.de');
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
