import { createApp } from "vue";
import {
  BottomSheet,
  EventBus,
  Loading,
  Meta,
  Notify,
  Dialog,
  Quasar,
} from "quasar";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

import App from "./App.vue";

const pinia = createPinia();
const bus = new EventBus();
pinia.use(piniaPluginPersistedstate);

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: {
    Notify,
    Loading,
    Dialog,
    BottomSheet,
    Meta,
  }, // import Quasar plugins and add here
});

myApp.use(pinia);
myApp.provide("bus", bus);

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount("#app");
