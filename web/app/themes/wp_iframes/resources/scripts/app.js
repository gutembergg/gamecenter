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
import GameCenter from "./gameCenter/GameCenter.vue";
// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';
import Vueform from '@vueform/vueform'
import vueformConfig from '../../vueform.config.js';

const app = createApp(GameCenter)
//app.use(ElementPlus)
app.use(Vueform, vueformConfig)
app.mount("#appGameCenterVue");

