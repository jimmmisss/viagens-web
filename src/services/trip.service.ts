import api from './api';
import type {CreateTripRequest, Trip, TripFilters, UpdateTripStatusRequest} from "../types/trip.ts";


export const tripService = {
  /**
   * Create a new trip request
   * @param data Trip creation data
   * @returns Promise with the created trip
   */
  async createTrip(data: CreateTripRequest): Promise<Trip> {
    const response = await api.post<Trip>('/trips', data);
    return response.data;
  },

  /**
   * Get a list of trips with optional filters
   * @param filters Optional filters for the trip list
   * @returns Promise with the list of trips
   */
  async getTrips(filters?: TripFilters): Promise<Trip[]> {
    const response = await api.get<Trip[]>('/trips', { params: filters });
    return response.data;
  },

  /**
   * Get a specific trip by ID
   * @param id Trip ID
   * @returns Promise with the trip data
   */
  async getTripById(id: string): Promise<Trip> {
    const response = await api.get<Trip>(`/trips/${id}`);
    return response.data;
  },

  /**
   * Update the status of a trip (approve/cancel)
   * @param id Trip ID
   * @param data Status update data
   * @returns Promise with the updated trip
   */
  async updateTripStatus(id: string, data: UpdateTripStatusRequest): Promise<Trip> {
    const response = await api.patch<Trip>(`/trips/${id}/status`, data);
    return response.data;
  },

  /**
   * Cancel an approved trip
   * @param id Trip ID
   * @param force Optional parameter to force cancellation even if within 7 days
   * @returns Promise with the updated trip
   */
  async cancelTrip(id: string, force: boolean = false): Promise<Trip> {
    const response = await api.post<Trip>(`/trips/${id}/cancel`, { force });
    return response.data;
  }
};
