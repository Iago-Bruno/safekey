import axios from "axios";

export const http = axios.create({
  baseURL: `http://98.81.255.202:8000`, // Link online
  // baseURL: `https://fc4c-200-129-71-101.ngrok-free.app`,
  headers: {
    "Content-type": "application/json",
  },
});
