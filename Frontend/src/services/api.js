// src/services/api.js
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://nearbyhappenings.onrender.com/nearby-happenings',
  withCredentials: true,
})
