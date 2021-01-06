import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Article from '../views/Article.vue';
import Error404 from '../views/Error404.vue';
import Blog from '../views/Blog.vue';

Vue.use(VueRouter);

/**
 * Aggiungere meta tag
 * Dinamici, statici per rotte
 */

const routes = [
  {
    path: '*',
    name: 'CatchAll',
    component: Error404,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/not-found',
    name: '404',
    component: Error404,
  },
  {
    path: '/blog/',
    name: 'Blog',
    component: Blog,
  },
  {
    path: '/blog/:article',
    name: 'Article',
    component: Article,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
