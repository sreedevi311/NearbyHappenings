import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://nearbyhappenings.onrender.com',
  withCredentials: true
});
