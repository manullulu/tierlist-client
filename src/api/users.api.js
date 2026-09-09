import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

export function getUser(userId) {
  return axios.get(API_URL + "/api/users/" + userId);
}
