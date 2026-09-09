import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

export function searchGames(query) {
  return axios.get(API_URL + "/api/games/search?q=" + encodeURIComponent(query));
}

export function getGame(gameId) {
  return axios.get(API_URL + "/api/games/" + gameId);
}
