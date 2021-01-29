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

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
