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
        setApiUri(process.env.NODE_ENV === 'development' ? 'http://localhost' : window.location.origin);
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
