<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, preencha todos os campos.';
    return;
  }

  try {
    isLoading.value = true;
    await authStore.login(email.value, password.value);
    
    // Redirect to the requested page or home
    const redirectPath = route.query.redirect as string || '/';
    router.push(redirectPath);
  } catch (error) {
    errorMessage.value = error as string || 'Falha ao fazer login. Verifique suas credenciais.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email"
            type="email"
            placeholder="Seu email"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Senha</label>
          <input 
            id="password"
            v-model="password"
            type="password"
            placeholder="Sua senha"
            required
          />
        </div>
        
        <button type="submit" :disabled="isLoading" class="login-button">
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
      
      <div class="register-link">
        Não tem uma conta? <router-link to="/register">Registre-se</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.login-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
  color: #2c3e50;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.login-button {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.login-button:hover {
  background-color: #1a2530;
}

.login-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
}

.register-link a {
  color: #3498db;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>