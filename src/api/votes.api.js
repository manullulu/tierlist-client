import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

export function voteForTierList(tierListId, value) {
  const token = localStorage.getItem("authToken");

  return axios.post(
    API_URL + "/api/tierlists/" + tierListId + "/vote",
    { value: value },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
}

export function removeVote(tierListId) {
  const token = localStorage.getItem("authToken");

  return axios.delete(API_URL + "/api/tierlists/" + tierListId + "/vote", {
    headers: { Authorization: "Bearer " + token },
  });
}
