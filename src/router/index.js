import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Article from '../views/Article.vue';

Vue.use(VueRouter);

const Blog = {
  template: '<div>blog</div>',
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
  routes,
});

export default router;
