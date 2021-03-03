import axios from 'axios';
import store from '../store/index';

const server = process.env.API;

//Route Guard
const requireAuth = async (to, from, next) => {
  try {
    await axios.post(`${server}auth/authorize`, {});
    next();
  } catch (err) {
    next({ name: 'Login' });
  }
};

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    beforeEnter: requireAuth,
    component: () => import('pages/Index.vue')
  }
];

export default routes;
