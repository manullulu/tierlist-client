import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

export function addItem(tierListId, gameId, gameName, gameImage, tier) {
  const token = localStorage.getItem("authToken");

  return axios.post(
    API_URL + "/api/tierlists/" + tierListId + "/items",
    {
      gameId: gameId,
      gameName: gameName,
      gameImage: gameImage,
      tier: tier,
    },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
}

export function updateItem(tierListId, itemId, tier, position) {
  const token = localStorage.getItem("authToken");

  const body = {};
  if (tier !== undefined) {
    body.tier = tier;
  }
  if (position !== undefined) {
    body.position = position;
  }

  return axios.put(API_URL + "/api/tierlists/" + tierListId + "/items/" + itemId, body, {
    headers: { Authorization: "Bearer " + token },
  });
}

export function deleteItem(tierListId, itemId) {
  const token = localStorage.getItem("authToken");

  return axios.delete(API_URL + "/api/tierlists/" + tierListId + "/items/" + itemId, {
    headers: { Authorization: "Bearer " + token },
  });
}
