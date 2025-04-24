// services/api.ts
import axios from "axios";

export const baseURL = "https://localhost:7079/api";

const api = axios.create({
    baseURL,
});

const token = localStorage.getItem("token");
if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
