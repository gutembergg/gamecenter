import domReady from '@roots/sage/client/dom-ready';

/**
 * Application entrypoint
 */
domReady(async () => {
  // ...
});

/**
 * @see {@link https://webpack.js.org/api/hot-module-replacement/}
 */
if (import.meta.webpackHot) import.meta.webpackHot.accept(console.error);

import { createApp } from "vue";
import { createWebHistory, createRouter } from 'vue-router';
import GameCenter from "./gameCenter/GameCenter.vue";
import Vueform from '@vueform/vueform'
import vueformConfig from '../../vueform.config.js';

import Championship from './gameCenter/components/championship/Championship.vue';
import Teams from './gameCenter/components/teams/Teams.vue';

const routes = [
  { path: '/championship', component: Championship },
  // {
  //   path: '/swsscup',
  //   component: SearchResults,
  // },
  // {
  //   path: `/topscore`,
  //   component: Cultes,
  // },
  {
    path: '/teams',
    component: Teams,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(GameCenter)

app.use(router);
app.use(Vueform, vueformConfig)
app.mount("#appGameCenterVue");

