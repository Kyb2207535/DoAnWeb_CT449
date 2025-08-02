import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; 
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const app = createApp(App);

// Sử dụng router
app.use(router);
app.provide("toast", toast);

app.mount("#app");


