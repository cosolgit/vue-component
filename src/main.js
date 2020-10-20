import Vue from "vue";
import App from "./App.vue";
import "./style/reset.css";
import router from "./router";
import ExConfirm from "./components/exConfirm";

Vue.prototype.$ExConfirm = ExConfirm;
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount("#app");
