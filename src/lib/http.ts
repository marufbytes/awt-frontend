import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
