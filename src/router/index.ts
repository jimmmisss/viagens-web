import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router';
import { authService } from '../services/auth.service';

// Define routes
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guest: true }
  },
  {
    path: '/trips',
    name: 'Trips',
    component: () => import('../views/TripsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/trips/new',
    name: 'NewTrip',
    component: () => import('../views/NewTripView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/trips/:id',
    name: 'TripDetails',
    component: () => import('../views/TripDetailsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard to check authentication
router.beforeEach((to, _, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isGuestOnly = to.matched.some(record => record.meta.guest);
  const isAuthenticated = authService.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if trying to access a protected route without authentication
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (isGuestOnly && isAuthenticated) {
    // Redirect to home if trying to access a guest-only route while authenticated
    next({ name: 'Home' });
  } else {
    // Proceed as normal
    next();
  }
});

export default router;