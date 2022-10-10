//Frameworks
import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import colors from 'vuetify/es5/util/colors'

//App
import App from "./app/App.vue";

//pages
import siteInfo from "./app/pages/siteInfo.vue";
import searchTools from "./app/pages/searchTools.vue";
import tagExplorer from "./app/pages/tagExplorer.vue";

//Uses
Vue.use(Vuetify);
Vue.use(VueRouter);

global.browser = require("webextension-polyfill");
Vue.prototype.$browser = global.browser;

const routes = [
  { path: "/siteInfo", component: siteInfo },
  { path: "/searchTools", component: searchTools },
  { path: "/tagExplorer", component: tagExplorer },
];

const router = new VueRouter({
  routes,
});

new Vue({
  el: "#app",
  router,
  vuetify: new Vuetify(),
  created() {
    this.$router.push("firstpage");
  },
  render: (h) => h(App),
});
