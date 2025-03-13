import { AuthUtils } from "@/utils/authUtils";
import axios from "axios";

const API_URL = import.meta.env.VITE_URL_API;
let isRefreshing = false;
let failedRequestsQueue: any[] = [];

export const http = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const token = AuthUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se a resposta foi 401 (não autorizado) e ainda não tentamos o refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Se já estiver tentando renovar, adiciona a requisição na fila
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const refreshToken = AuthUtils.getRefreshToken();

        if (!refreshToken) {
          throw new Error("Refresh token não encontrado.");
        }

        // Chama a API para renovar o token
        const response = await axios.post(`${API_URL}/refresh/`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        // Atualiza os tokens armazenados
        AuthUtils.armazenarToken(newAccessToken);
        AuthUtils.armazenarRefreshToken(newRefreshToken);

        // Refaz as requisições que estavam na fila
        failedRequestsQueue.forEach((req) => req.resolve(newAccessToken));
        failedRequestsQueue = [];

        // Define o novo token na requisição original e refaz ela
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (err) {
        failedRequestsQueue.forEach((req) => req.reject(err));
        failedRequestsQueue = [];
        AuthUtils.logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
