import Vue from "vue";
import App from "./components/App.vue";

if (process.env.NET_ENV === "development") {
  Vue.config.devtools = true;
}

export default new Vue({
  el: "#app",
  render: h => h(App)
});
