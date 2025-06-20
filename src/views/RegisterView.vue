<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

async function handleRegister() {
  // Basic validation
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Por favor, preencha todos os campos.';
    return;
  }

  if (password.value.length < 8) {
    errorMessage.value = 'A senha deve ter pelo menos 8 caracteres.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem.';
    return;
  }

  try {
    isLoading.value = true;
    await authStore.register(name.value, email.value, password.value);
    
    // Redirect to home after successful registration
    router.push('/');
  } catch (error) {
    errorMessage.value = error as string || 'Falha ao registrar. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Registrar</h2>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Nome</label>
          <input 
            id="name"
            v-model="name"
            type="text"
            placeholder="Seu nome completo"
            required
          />
        </div>
        
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
            placeholder="Sua senha (mínimo 8 caracteres)"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha</label>
          <input 
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirme sua senha"
            required
          />
        </div>
        
        <button type="submit" :disabled="isLoading" class="register-button">
          {{ isLoading ? 'Registrando...' : 'Registrar' }}
        </button>
      </form>
      
      <div class="login-link">
        Já tem uma conta? <router-link to="/login">Faça login</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.register-card {
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

.register-form {
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

.register-button {
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

.register-button:hover {
  background-color: #1a2530;
}

.register-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
}

.login-link a {
  color: #3498db;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>