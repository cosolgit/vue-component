import Vue from "vue";
import ExConfirm from "./index.vue";

let newInstance;
const ConfirmInstance = Vue.extend(ExConfirm);

const initInstance = () => {
  newInstance = new ConfirmInstance();
  document.body.appendChild(newInstance.$mount().$el);
};

export default options => {
  !newInstance && initInstance();

  Object.assign(newInstance, options);

  return newInstance.show(vm => {
    newInstance = null;
  });
};

