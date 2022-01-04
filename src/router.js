import { createRouter, createWebHashHistory } from 'vue-router';
import axios from 'axios';
import Home from './views/Home.vue';
import Login from './views/Login.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        meta: { requiresAuth: true },
        component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    axios.get('/peticionesPublicacion')
    .catch(err => {
      if (err.response.status === 401) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    });
  } else {
    next()
  }
})

export default router;
