<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTripStore } from '../stores/trip.store';
import { CreateTripRequest } from '../types/trip';

const router = useRouter();
const tripStore = useTripStore();

const destination = ref('');
const startDate = ref('');
const endDate = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

// Get today's date in YYYY-MM-DD format for min attribute
const today = new Date().toISOString().split('T')[0];

async function handleSubmit() {
  // Basic validation
  if (!destination.value || !startDate.value || !endDate.value) {
    errorMessage.value = 'Por favor, preencha todos os campos.';
    return;
  }

  // Validate dates
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  if (end <= start) {
    errorMessage.value = 'A data de fim deve ser posterior à data de início.';
    return;
  }

  try {
    isLoading.value = true;

    // Convert date strings to ISO format with time component
    const formattedStartDate = new Date(startDate.value + 'T00:00:00Z').toISOString();
    const formattedEndDate = new Date(endDate.value + 'T00:00:00Z').toISOString();

    const tripData: CreateTripRequest = {
      destination: destination.value,
      start_date: formattedStartDate,
      end_date: formattedEndDate
    };

    await tripStore.createTrip(tripData);

    // Redirect to trips list after successful creation
    router.push('/trips');
  } catch (error) {
    errorMessage.value = error as string || 'Falha ao criar viagem. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
}

function cancel() {
  router.push('/trips');
}
</script>

<template>
  <div class="new-trip-container">
    <div class="new-trip-card">
      <h2>Nova Solicitação de Viagem</h2>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="new-trip-form">
        <div class="form-group">
          <label for="destination">Destino</label>
          <input 
            id="destination"
            v-model="destination"
            type="text"
            placeholder="Para onde você vai?"
            required
          />
        </div>

        <div class="form-group">
          <label for="startDate">Data de Início</label>
          <input 
            id="startDate"
            v-model="startDate"
            type="date"
            :min="today"
            required
          />
        </div>

        <div class="form-group">
          <label for="endDate">Data de Fim</label>
          <input 
            id="endDate"
            v-model="endDate"
            type="date"
            :min="startDate || today"
            required
          />
        </div>

        <div class="form-actions">
          <button type="button" @click="cancel" class="cancel-button">
            Cancelar
          </button>
          <button type="submit" :disabled="isLoading" class="submit-button">
            {{ isLoading ? 'Enviando...' : 'Solicitar Viagem' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.new-trip-container {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.new-trip-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
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

.new-trip-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.cancel-button {
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #7f8c8d;
}

.submit-button {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #1a2530;
}

.submit-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .new-trip-card {
    margin: 0 1rem;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 1rem;
  }

  .cancel-button, .submit-button {
    width: 100%;
  }
}
</style>
