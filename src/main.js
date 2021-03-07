import Vue from 'vue';
import VueGtag from 'vue-gtag';
import VueMeta from 'vue-meta';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueGtag, {
  config: { id: 'UA-98330359-1' },
}, router);

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true,
});

// Per sviluppo e rendering in Github Pages:
// https://github.com/chrisvfritz/prerender-spa-plugin

new Vue({
  router,
  render: (h) => h(App),
  mounted: () => document.dispatchEvent(new Event('x-app-rendered')),
}).$mount('#app');
