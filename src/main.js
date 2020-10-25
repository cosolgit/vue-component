import Vue from "vue";
import App from "./App.vue";
import "./style/reset.css";
import router from "./router";
import ExConfirm from "./components/exConfirm";
import * as directives from "./components/watermark";

Vue.config.productionTip = false;
Vue.prototype.$ExConfirm = ExConfirm;

Object.keys(directives).forEach(key => Vue.directive(key, directives[key]));

new Vue({
  router,
  render: h => h(App),
}).$mount("#app");
