<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTripStore } from '../stores/trip.store';
import { useAuthStore } from '../stores/auth.store';
import { TripStatus } from '../types/trip';

const route = useRoute();
const router = useRouter();
const tripStore = useTripStore();
const authStore = useAuthStore();

const tripId = route.params.id as string;
const isLoading = ref(false);
const error = ref<string | null>(null);
const confirmAction = ref<string | null>(null);

// Get current user ID for permission checks
const currentUserId = computed(() => authStore.currentUser?.id || '');

// Get the trip from the store
const trip = computed(() => tripStore.currentTrip);

// Check if the current user is the requester of the trip
const isRequester = computed(() => 
  trip.value?.requester_id === currentUserId.value
);

// Check if the trip can be canceled (only approved trips by the requester)
const canCancel = computed(() => 
  isRequester.value && 
  trip.value?.status === 'aprovado' &&
  // Check if start date is more than 7 days away
  new Date(trip.value.start_date).getTime() - new Date().getTime() > 7 * 24 * 60 * 60 * 1000
);

// Check if the trip can be approved (only requested trips and not by the requester)
const canApprove = computed(() => 
  !isRequester.value && 
  trip.value?.status === 'solicitado'
);

// Format date for display
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

// Load trip data on component mount
onMounted(async () => {
  try {
    isLoading.value = true;
    await tripStore.fetchTripById(tripId);
    
    if (!trip.value) {
      error.value = 'Viagem não encontrada.';
    }
  } catch (err) {
    error.value = 'Falha ao carregar detalhes da viagem.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

// Approve trip
async function approveTrip() {
  if (!trip.value) return;
  
  try {
    isLoading.value = true;
    await tripStore.updateTripStatus(trip.value.id, { status: 'aprovado' });
    confirmAction.value = null;
  } catch (err) {
    error.value = 'Falha ao aprovar viagem.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

// Cancel trip
async function cancelTrip() {
  if (!trip.value) return;
  
  try {
    isLoading.value = true;
    
    if (trip.value.status === 'aprovado') {
      await tripStore.cancelTrip(trip.value.id);
    } else {
      await tripStore.updateTripStatus(trip.value.id, { status: 'cancelado' });
    }
    
    confirmAction.value = null;
  } catch (err) {
    error.value = 'Falha ao cancelar viagem.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

// Go back to trips list
function goBack() {
  router.push('/trips');
}
</script>

<template>
  <div class="trip-details-container">
    <div v-if="isLoading" class="loading">
      Carregando detalhes da viagem...
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
      <button @click="goBack" class="back-button">Voltar para lista</button>
    </div>
    
    <div v-else-if="!trip" class="not-found">
      <p>Viagem não encontrada.</p>
      <button @click="goBack" class="back-button">Voltar para lista</button>
    </div>
    
    <div v-else class="trip-details-card">
      <div class="card-header">
        <h2>Detalhes da Viagem</h2>
        <span :class="['status-badge', `status-${trip.status}`]">
          {{ trip.status }}
        </span>
      </div>
      
      <div class="trip-info">
        <div class="info-group">
          <h3>Destino</h3>
          <p>{{ trip.destination }}</p>
        </div>
        
        <div class="info-group">
          <h3>Período</h3>
          <p>
            <strong>Início:</strong> {{ formatDate(trip.start_date) }}<br>
            <strong>Fim:</strong> {{ formatDate(trip.end_date) }}
          </p>
        </div>
        
        <div class="info-group">
          <h3>Datas de Registro</h3>
          <p>
            <strong>Criado em:</strong> {{ formatDate(trip.created_at) }}<br>
            <strong>Atualizado em:</strong> {{ formatDate(trip.updated_at) }}
          </p>
        </div>
      </div>
      
      <div class="trip-actions">
        <button @click="goBack" class="back-button">
          Voltar
        </button>
        
        <div v-if="canApprove || (isRequester && trip.status === 'solicitado')" class="action-buttons">
          <button 
            v-if="canApprove" 
            @click="confirmAction = 'approve'" 
            class="approve-button"
          >
            Aprovar Viagem
          </button>
          
          <button 
            v-if="isRequester && trip.status === 'solicitado'" 
            @click="confirmAction = 'cancel'" 
            class="cancel-button"
          >
            Cancelar Solicitação
          </button>
        </div>
        
        <button 
          v-if="canCancel" 
          @click="confirmAction = 'cancel'" 
          class="cancel-button"
        >
          Cancelar Viagem
        </button>
      </div>
      
      <!-- Confirmation Dialog -->
      <div v-if="confirmAction" class="confirmation-dialog">
        <div class="confirmation-content">
          <h3>Confirmar Ação</h3>
          
          <p v-if="confirmAction === 'approve'">
            Tem certeza que deseja aprovar esta viagem?
          </p>
          
          <p v-else-if="confirmAction === 'cancel'">
            Tem certeza que deseja cancelar esta viagem?
          </p>
          
          <div class="confirmation-actions">
            <button @click="confirmAction = null" class="cancel-action-button">
              Não
            </button>
            
            <button 
              v-if="confirmAction === 'approve'" 
              @click="approveTrip" 
              class="confirm-action-button"
            >
              Sim, Aprovar
            </button>
            
            <button 
              v-else-if="confirmAction === 'cancel'" 
              @click="cancelTrip" 
              class="confirm-action-button"
            >
              Sim, Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trip-details-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.loading, .not-found {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.trip-details-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
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

.trip-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.info-group h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.info-group p {
  color: #555;
  line-height: 1.6;
}

.trip-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.back-button {
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #7f8c8d;
}

.approve-button {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.approve-button:hover {
  background-color: #27ae60;
}

.cancel-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #c0392b;
}

.confirmation-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.confirmation-content {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.confirmation-content h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-action-button {
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-action-button:hover {
  background-color: #7f8c8d;
}

.confirm-action-button {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.confirm-action-button:hover {
  background-color: #1a2530;
}

@media (max-width: 768px) {
  .trip-details-card {
    margin: 0 1rem;
    padding: 1.5rem;
  }
  
  .trip-info {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .trip-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: space-between;
  }
  
  .back-button, .approve-button, .cancel-button {
    width: 100%;
  }
}
</style>