//Frameworks
import Vue from 'vue'
import Vuetify from "vuetify";
import VueRouter from 'vue-router';

//App
import App from './app/App.vue'

//pages
import Home from './app/pages/home/home.vue'
import SecondPage from './app/pages/secondPage/SecondPage.vue'

//Uses
Vue.use(Vuetify);
Vue.use(VueRouter);

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

const routes = [
  { path: '/home', component: Home },
  { path: '/secondPage', component: SecondPage },
]

const router = new VueRouter({
  routes
})

// let iframe = document.getElementById("newsela-control-bar")
// var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
// let div = innerDoc.createElement("div")
// div.id = "app"
// let app = innerDoc.body.appendChild(div)
// console.log("iframe", iframe)
// while(!iframe){
//   console.log("waiting for the iframe to be created")
//   iframe = document.getElementById("newsela-control-bar")
// }

// var all = innerDoc.getElementsByTagName("*");

// for (let y of all) {
//   console.log("element is:", y)
// }

// let x = innerDoc.querySelector('.mainapp')
// console.log("x is:", x)

new Vue({
  el: "#app",
  router,
  vuetify: new Vuetify(),
  created() {
    this.$router.push('home');
  },
  render: h => h(App)
})

console.log(iframe)
