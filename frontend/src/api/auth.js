// frontend/src/api/auth.js
import axios from "axios";

const API = "http://localhost:5000/api/auth";

// LOGIN
export const loginUser = async (email, password) => {
  return axios.post(`${API}/login`, { email, password });
};

// REGISTER
export const registerUser = async (name, email, password) => {
  return axios.post(`${API}/register`, { name, email, password });
};
