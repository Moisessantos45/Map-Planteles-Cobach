import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import mapboxgl from "mapbox-gl";
import { createPinia } from "pinia";

const api_key = import.meta.env.VITE_API_KEY;

mapboxgl.accessToken = api_key;
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");
