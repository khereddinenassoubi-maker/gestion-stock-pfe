import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
    timeout: 10000
});

export const getErrorMessage = (error, fallback = "Une erreur est survenue.") =>
    error.response?.data?.message || error.response?.data?.detail || fallback;

export default api;
