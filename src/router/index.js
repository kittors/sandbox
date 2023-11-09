import Vue from "vue";
import VueRouter from "vue-router";
import indexView from "../view/indexView.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: indexView,
    },
  ],
});

export default router;
