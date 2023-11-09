import Vue from "vue";
import App from "./App.vue";
import router from "./src/router";
import "./src/css/global.css";
Vue.config.productionTip = false;
import zhCN from "./src/assets/js/zh-CN";
import { VeLocale } from "vue-easytable";
const e = window.onerror;
window.onerror = function (message, source, lineno, colno, error) {
  if (message === "ResizeObserver loop limit exceeded") {
    console.warn("Ignored: ResizeObserver loop limit exceeded");
    return false;
  } else {
    return error;
  }
};

import ClassType from "./src/components/classType/ClassType.vue";
Vue.component("ClassType", ClassType);

//切换到中文
VeLocale.use(zhCN);
import "vue-easytable/libs/theme-default/index.css"; // import style
import VueEasytable from "vue-easytable"; // import library
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
Vue.use(VueEasytable);
Vue.use(VXETable);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
