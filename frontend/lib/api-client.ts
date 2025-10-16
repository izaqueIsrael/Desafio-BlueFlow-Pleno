import axios from 'axios';

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3001';
const VIDEOS_API_URL = process.env.NEXT_PUBLIC_VIDEOS_API_URL || 'http://localhost:3002';
const FAVORITES_API_URL = process.env.NEXT_PUBLIC_FAVORITES_API_URL || 'http://localhost:3003';

export class ApiClient {
  private static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Auth Service
  static async register(email: string, password: string, name: string) {
    const response = await axios.post(`${AUTH_API_URL}/auth/register`, {
      email,
      password,
      name,
    });
    return response.data;
  }

  static async login(email: string, password: string) {
    const response = await axios.post(`${AUTH_API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  }

  static async getProfile() {
    const response = await axios.get(`${AUTH_API_URL}/auth/profile`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Videos Service
  static async searchVideos(query: string, pageToken?: string) {
    const params: any = { query };
    if (pageToken) params.pageToken = pageToken;

    const response = await axios.get(`${VIDEOS_API_URL}/videos/search`, {
      headers: this.getAuthHeaders(),
      params,
    });
    return response.data;
  }

  static async getTrendingVideos() {
    const response = await axios.get(`${VIDEOS_API_URL}/videos/trending`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  static async getVideoById(videoId: string) {
    const response = await axios.get(`${VIDEOS_API_URL}/videos/${videoId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  // Favorites Service
  static async getFavorites() {
    const response = await axios.get(`${FAVORITES_API_URL}/favorites`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  static async addFavorite(videoId: string, videoData: any) {
    const response = await axios.post(
      `${FAVORITES_API_URL}/favorites`,
      { videoId, videoData },
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  static async removeFavorite(videoId: string) {
    const response = await axios.delete(
      `${FAVORITES_API_URL}/favorites/${videoId}`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }

  static async checkFavorite(videoId: string) {
    const response = await axios.get(
      `${FAVORITES_API_URL}/favorites/check/${videoId}`,
      { headers: this.getAuthHeaders() },
    );
    return response.data;
  }
}