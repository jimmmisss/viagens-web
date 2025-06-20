<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push('/');
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Página Não Encontrada</h2>
      <p>A página que você está procurando não existe ou foi movida.</p>
      <button @click="goHome" class="home-button">Voltar para a Página Inicial</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  text-align: center;
}

.not-found-content {
  max-width: 500px;
  padding: 2rem;
}

h1 {
  font-size: 6rem;
  color: #2c3e50;
  margin: 0;
  line-height: 1;
}

h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

p {
  color: #555;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.home-button {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.home-button:hover {
  background-color: #1a2530;
}
</style>