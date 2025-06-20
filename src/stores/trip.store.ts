import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { tripService } from '../services/trip.service';
import type {CreateTripRequest, Trip, TripFilters, UpdateTripStatusRequest} from "../types/trip.ts";

export const useTripStore = defineStore('trip', () => {
  // State
  const trips = ref<Trip[]>([]);
  const currentTrip = ref<Trip | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const allTrips = computed(() => trips.value);
  const tripById = (id: string) => computed(() => 
    trips.value.find(trip => trip.id === id)
  );

  // Actions
  async function fetchTrips(filters?: TripFilters) {
    loading.value = true;
    error.value = null;

    try {
      trips.value = await tripService.getTrips(filters);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch trips';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchTripById(id: string) {
    loading.value = true;
    error.value = null;

    try {
      currentTrip.value = await tripService.getTripById(id);
      return currentTrip.value;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch trip';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function createTrip(data: CreateTripRequest) {
    loading.value = true;
    error.value = null;

    try {
      const newTrip = await tripService.createTrip(data);
      trips.value.push(newTrip);
      return newTrip;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to create trip';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function updateTripStatus(id: string, data: UpdateTripStatusRequest) {
    loading.value = true;
    error.value = null;

    try {
      const updatedTrip = await tripService.updateTripStatus(id, data);

      // Update in the trips array
      const index = trips.value.findIndex(trip => trip.id === id);
      if (index !== -1) {
        trips.value[index] = updatedTrip;
      }

      // Update currentTrip if it's the same trip
      if (currentTrip.value?.id === id) {
        currentTrip.value = updatedTrip;
      }

      return updatedTrip;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to update trip status';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function cancelTrip(id: string, force: boolean = false) {
    loading.value = true;
    error.value = null;

    try {
      const updatedTrip = await tripService.cancelTrip(id, force);

      // Update in the trips array
      const index = trips.value.findIndex(trip => trip.id === id);
      if (index !== -1) {
        trips.value[index] = updatedTrip;
      }

      // Update currentTrip if it's the same trip
      if (currentTrip.value?.id === id) {
        currentTrip.value = updatedTrip;
      }

      return updatedTrip;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to cancel trip';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    trips,
    currentTrip,
    loading,
    error,

    // Getters
    allTrips,
    tripById,

    // Actions
    fetchTrips,
    fetchTripById,
    createTrip,
    updateTripStatus,
    cancelTrip
  };
});
