<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useTripStore } from '../stores/trip.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const tripStore = useTripStore();
const router = useRouter();

const isLoading = ref(false);
const error = ref<string | null>(null);

const currentUser = computed(() => authStore.currentUser);
const recentTrips = computed(() => tripStore.allTrips ? tripStore.allTrips.slice(0, 3) : []); // Get up to 3 recent trips

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }

  try {
    isLoading.value = true;
    // Fetch recent trips
    await tripStore.fetchTrips();
  } catch (err) {
    error.value = 'Falha ao carregar viagens recentes.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

function navigateToTrips() {
  router.push('/trips');
}

function navigateToNewTrip() {
  router.push('/trips/new');
}
</script>

<template>
  <div class="home-container">
    <section class="welcome-section">
      <h1>Bem-vindo ao Sistema de Viagens</h1>
      <p v-if="currentUser" class="welcome-message">
        Olá, {{ currentUser.name }}! Gerencie suas solicitações de viagens de forma simples e rápida.
      </p>
    </section>

    <section class="actions-section">
      <div class="action-card" @click="navigateToTrips">
        <h3>Minhas Viagens</h3>
        <p>Visualize e gerencie todas as suas solicitações de viagens.</p>
      </div>

      <div class="action-card" @click="navigateToNewTrip">
        <h3>Nova Viagem</h3>
        <p>Crie uma nova solicitação de viagem.</p>
      </div>
    </section>

    <section class="recent-trips-section">
      <h2>Viagens Recentes</h2>

      <div v-if="isLoading" class="loading">
        Carregando viagens recentes...
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else-if="recentTrips.length === 0" class="no-trips">
        <p>Você ainda não tem viagens. Crie sua primeira solicitação de viagem!</p>
        <button @click="navigateToNewTrip" class="create-trip-btn">Nova Viagem</button>
      </div>

      <div v-else class="trips-list">
        <div v-for="trip in recentTrips" :key="trip.id" class="trip-card">
          <div class="trip-header">
            <h3>{{ trip.destination }}</h3>
            <span :class="['status-badge', `status-${trip.status}`]">
              {{ trip.status }}
            </span>
          </div>

          <div class="trip-dates">
            <div>
              <strong>Início:</strong> {{ new Date(trip.start_date).toLocaleDateString() }}
            </div>
            <div>
              <strong>Fim:</strong> {{ new Date(trip.end_date).toLocaleDateString() }}
            </div>
          </div>

          <router-link :to="`/trips/${trip.id}`" class="view-details-btn">
            Ver Detalhes
          </router-link>
        </div>
      </div>

      <div v-if="recentTrips.length > 0" class="view-all">
        <router-link to="/trips" class="view-all-link">Ver todas as viagens</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1000px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 2rem;
}

.welcome-message {
  font-size: 1.2rem;
  color: #555;
  margin-top: 0.5rem;
}

.actions-section {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.action-card {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.action-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.recent-trips-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.recent-trips-section h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.loading, .no-trips {
  text-align: center;
  padding: 2rem 0;
  color: #666;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 1rem;
}

.trips-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.trip-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.status-solicitado {
  background-color: #f39c12;
  color: white;
}

.status-aprovado {
  background-color: #2ecc71;
  color: white;
}

.status-cancelado {
  background-color: #e74c3c;
  color: white;
}

.trip-dates {
  margin-bottom: 1rem;
  color: #555;
}

.view-details-btn {
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.view-details-btn:hover {
  background-color: #2980b9;
}

.create-trip-btn {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.create-trip-btn:hover {
  background-color: #1a2530;
}

.view-all {
  text-align: center;
  margin-top: 1.5rem;
}

.view-all-link {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}

.view-all-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .actions-section {
    flex-direction: column;
  }

  .trips-list {
    grid-template-columns: 1fr;
  }
}
</style>
