import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';

import { authService } from '../services/auth.service';
import type {User} from "../types/user.ts";

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => authService.isAuthenticated());
  const currentUser = computed(() => user.value);

  // Actions
  async function register(name: string, email: string, password: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.register({ name, email, password });
      user.value = response.user;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to register';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login({ email, password });
      user.value = response.user;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to login';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    authService.logout();
    user.value = null;
  }

  async function initializeStore() {
    if (authService.isAuthenticated()) {
      try {
        loading.value = true;
        user.value = await authService.getCurrentUser();
      } catch (err: any) {
        console.error('Failed to fetch user information:', err);
        // If we can't get the user info, consider the user as logged out
        authService.logout();
      } finally {
        loading.value = false;
      }
    }
  }

  // Initialize the store when it's created
  onMounted(() => {
    initializeStore();
  });

  return {
    // State
    user,
    loading,
    error,

    // Getters
    isAuthenticated,
    currentUser,

    // Actions
    register,
    login,
    logout,
    initializeStore,
  };
});
