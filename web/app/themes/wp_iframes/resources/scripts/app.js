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
import Vueform from '@vueform/vueform'
import vueformConfig from '../../vueform.config.js';

const app = createApp(GameCenter)

app.use(Vueform, vueformConfig)
app.mount("#appGameCenterVue");
