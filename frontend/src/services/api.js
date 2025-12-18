import axios from "axios";

const api = axios.create({
  baseURL: "https://kilometro1-backend.onrender.com/api",
});

/**
 * Interceptor para enviar token JWT
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;


/**
 * Axios centralizado
 * IMPORTANTE:
 * - baseURL = http://localhost:5000
 * - NO añadimos /api aquí

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
 */