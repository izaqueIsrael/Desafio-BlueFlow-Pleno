import axios, { AxiosInstance } from 'axios';

export class HttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async get<T>(url: string, token?: string): Promise<T> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await this.client.get<T>(url, { headers });
    return response.data;
  }

  async post<T>(url: string, data: any, token?: string): Promise<T> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await this.client.post<T>(url, data, { headers });
    return response.data;
  }
}