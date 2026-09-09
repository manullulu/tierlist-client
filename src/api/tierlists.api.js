import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

export function getAllTierLists(search, sort) {
  let url = API_URL + "/api/tierlists?sort=" + sort;

  if (search) {
    url = url + "&search=" + encodeURIComponent(search);
  }

  return axios.get(url);
}

export function getTierList(tierListId) {
  const token = localStorage.getItem("authToken");

  // Le token est facultatif ici : il sert à voir ses listes privées et son propre vote
  if (token) {
    return axios.get(API_URL + "/api/tierlists/" + tierListId, {
      headers: { Authorization: "Bearer " + token },
    });
  }

  return axios.get(API_URL + "/api/tierlists/" + tierListId);
}

export function getUserTierLists(userId) {
  const token = localStorage.getItem("authToken");

  if (token) {
    return axios.get(API_URL + "/api/tierlists/user/" + userId, {
      headers: { Authorization: "Bearer " + token },
    });
  }

  return axios.get(API_URL + "/api/tierlists/user/" + userId);
}

export function createTierList(title, description, isPublic, tiers) {
  const token = localStorage.getItem("authToken");

  return axios.post(
    API_URL + "/api/tierlists",
    {
      title: title,
      description: description,
      isPublic: isPublic,
      tiers: tiers,
    },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
}

export function updateTierList(tierListId, title, description, isPublic, tiers) {
  const token = localStorage.getItem("authToken");

  return axios.put(
    API_URL + "/api/tierlists/" + tierListId,
    {
      title: title,
      description: description,
      isPublic: isPublic,
      tiers: tiers,
    },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
}

export function deleteTierList(tierListId) {
  const token = localStorage.getItem("authToken");

  return axios.delete(API_URL + "/api/tierlists/" + tierListId, {
    headers: { Authorization: "Bearer " + token },
  });
}
