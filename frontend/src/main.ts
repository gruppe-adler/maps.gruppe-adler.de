import Vue from 'vue';
import App from './App.vue';
import router from './router';


import {
  MdAvatar,
  MdButton,
  MdMenu,
  MdIcon,
  MdList,
  MdProgress,
  MdRipple
// @ts-ignore
} from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.min.css';

Vue.use(MdAvatar);
Vue.use(MdButton);
Vue.use(MdMenu);
Vue.use(MdIcon);
Vue.use(MdList);
Vue.use(MdProgress);
Vue.use(MdRipple);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
