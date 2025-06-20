<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const currentUser = computed(() => authStore.currentUser);

function logout() {
  authStore.logout();
  router.push('/login');
}

// Fetch current user data when the app loads if the user is authenticated
onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      await authStore.fetchCurrentUser();
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }
});
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo">
        <h1>Viagens App</h1>
      </div>
      <nav class="app-nav">
        <template v-if="isAuthenticated">
          <!-- Navigation for authenticated users -->
          <router-link to="/">Home</router-link>
          <router-link to="/trips">Minhas Viagens</router-link>
          <router-link to="/trips/new">Nova Viagem</router-link>
          <span class="user-info" v-if="currentUser">
            Olá, {{ currentUser.name }}
          </span>
          <button @click="logout" class="logout-btn">Sair</button>
        </template>
        <template v-else>
          <!-- Navigation for guests -->
          <router-link to="/login">Login</router-link>
          <router-link to="/register">Registrar</router-link>
        </template>
      </nav>
    </header>

    <main class="app-content">
      <!-- Router view where components will be rendered -->
      <router-view />
    </main>

    <footer class="app-footer">
      <p>&copy; 2023 Viagens App</p>
    </footer>
  </div>
</template>

<style>
/* Global styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.app-nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.app-nav a:hover,
.app-nav a.router-link-active {
  background-color: #1a2530;
}

.user-info {
  margin-left: 1rem;
  font-weight: bold;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.app-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>
