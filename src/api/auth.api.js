import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

export function signup(email, password, name, avatar) {
  return axios.post(API_URL + "/auth/signup", {
    email: email,
    password: password,
    name: name,
    avatar: avatar,
  });
}

export function login(email, password) {
  return axios.post(API_URL + "/auth/login", {
    email: email,
    password: password,
  });
}

export function verify(token) {
  return axios.get(API_URL + "/auth/verify", {
    headers: { Authorization: "Bearer " + token },
  });
}
