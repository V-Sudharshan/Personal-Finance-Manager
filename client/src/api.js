import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api/v1" });

// User Authentication
export const register = (userData) => API.post("/users/register", userData);
export const login = (userData) => API.post("/users/login", userData);
