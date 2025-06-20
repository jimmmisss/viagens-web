import api from './api';
import type {AuthResponse, LoginRequest, RegisterRequest, User} from "../types/user.ts";


export const authService = {
  /**
   * Register a new user
   * @param data User registration data
   * @returns Promise with the authentication response
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/register', data);
    // Store the token in localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  /**
   * Login a user
   * @param data User login credentials
   * @returns Promise with the authentication response
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', data);
    // Store the token in localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem('token');
  },

  /**
   * Check if the user is authenticated
   * @returns True if the user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  /**
   * Get the current user information
   * @returns Promise with the user information
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/me');
    return response.data;
  }
};
