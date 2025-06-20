<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTripStore } from '../stores/trip.store';
import type {TripStatus} from "../types/trip.ts";

const router = useRouter();
const tripStore = useTripStore();

const isLoading = ref(false);
const error = ref<string | null>(null);

// Filter state
const statusFilter = ref<TripStatus | ''>('');
const destinationFilter = ref('');
const startDateFilter = ref('');
const endDateFilter = ref('');

// Computed filtered trips
const filteredTrips = computed(() => {
  let result = tripStore.allTrips ? [...tripStore.allTrips] : [];

  // Apply status filter
  if (statusFilter.value) {
    result = result.filter(trip => trip.status === statusFilter.value);
  }

  // Apply destination filter (case insensitive)
  if (destinationFilter.value) {
    const searchTerm = destinationFilter.value.toLowerCase();
    result = result.filter(trip => 
      trip.destination.toLowerCase().includes(searchTerm)
    );
  }

  // Apply start date filter
  if (startDateFilter.value) {
    const filterDate = new Date(startDateFilter.value);
    result = result.filter(trip => {
      const tripDate = new Date(trip.start_date);
      return tripDate >= filterDate;
    });
  }

  // Apply end date filter
  if (endDateFilter.value) {
    const filterDate = new Date(endDateFilter.value);
    result = result.filter(trip => {
      const tripDate = new Date(trip.end_date);
      return tripDate <= filterDate;
    });
  }

  return result;
});

// Load trips on component mount
onMounted(async () => {
  try {
    isLoading.value = true;
    await tripStore.fetchTrips();
  } catch (err) {
    error.value = 'Falha ao carregar viagens.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});


// Reset filters
function resetFilters() {
  statusFilter.value = '';
  destinationFilter.value = '';
  startDateFilter.value = '';
  endDateFilter.value = '';
}

// Navigate to trip details
function viewTripDetails(tripId: string) {
  router.push(`/trips/${tripId}`);
}

// Navigate to new trip form
function createNewTrip() {
  router.push('/trips/new');
}

// Format date for display
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}
</script>

<template>
  <div class="trips-container">
    <div class="trips-header">
      <h1>Minhas Viagens</h1>
      <button @click="createNewTrip" class="new-trip-btn">Nova Viagem</button>
    </div>

    <div class="filters-section">
      <h3>Filtros</h3>
      <div class="filters-form">
        <div class="filter-group">
          <label for="status">Status</label>
          <select id="status" v-model="statusFilter">
            <option value="">Todos</option>
            <option value="solicitado">Solicitado</option>
            <option value="aprovado">Aprovado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="destination">Destino</label>
          <input 
            id="destination" 
            v-model="destinationFilter" 
            type="text" 
            placeholder="Filtrar por destino"
          />
        </div>

        <div class="filter-group">
          <label for="startDate">Data de Início (a partir de)</label>
          <input 
            id="startDate" 
            v-model="startDateFilter" 
            type="date"
          />
        </div>

        <div class="filter-group">
          <label for="endDate">Data de Fim (até)</label>
          <input 
            id="endDate" 
            v-model="endDateFilter" 
            type="date"
          />
        </div>

        <div class="filter-actions">
          <button @click="resetFilters" class="reset-btn">Limpar Filtros</button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      Carregando viagens...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="filteredTrips?.length === 0" class="no-trips">
      <p v-if="tripStore.allTrips?.length === 0">
        Você ainda não tem viagens. Crie sua primeira solicitação de viagem!
      </p>
      <p v-else>
        Nenhuma viagem encontrada com os filtros selecionados.
      </p>
      <button v-if="tripStore.allTrips?.length === 0" @click="createNewTrip" class="create-trip-btn">
        Nova Viagem
      </button>
    </div>

    <div v-else class="trips-table-container">
      <table class="trips-table">
        <thead>
          <tr>
            <th>Destino</th>
            <th>Data de Início</th>
            <th>Data de Fim</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trip in filteredTrips" :key="trip.id">
            <td>{{ trip.destination }}</td>
            <td>{{ formatDate(trip.start_date) }}</td>
            <td>{{ formatDate(trip.end_date) }}</td>
            <td>
              <span :class="['status-badge', `status-${trip.status}`]">
                {{ trip.status }}
              </span>
            </td>
            <td>
              <button @click="viewTripDetails(trip.id)" class="view-btn">
                Ver Detalhes
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.trips-container {
  max-width: 1200px;
  margin: 0 auto;
}

.trips-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.new-trip-btn {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.new-trip-btn:hover {
  background-color: #1a2530;
}

.filters-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.filters-section h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.filters-form {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: bold;
  color: #2c3e50;
}

.filter-group input,
.filter-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.filter-actions {
  display: flex;
  align-items: flex-end;
}

.reset-btn {
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background-color: #7f8c8d;
}

.loading, .no-trips {
  text-align: center;
  padding: 3rem 0;
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

.trips-table-container {
  overflow-x: auto;
}

.trips-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.trips-table th,
.trips-table td {
  padding: 1rem;
  text-align: left;
}

.trips-table th {
  background-color: #2c3e50;
  color: white;
}

.trips-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.trips-table tr:hover {
  background-color: #f1f1f1;
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

.view-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-btn:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .filters-form {
    grid-template-columns: 1fr;
  }

  .trips-table th,
  .trips-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
