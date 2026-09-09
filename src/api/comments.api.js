import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

export function getComments(tierListId) {
  return axios.get(API_URL + "/api/tierlists/" + tierListId + "/comments");
}

export function addComment(tierListId, content) {
  const token = localStorage.getItem("authToken");

  return axios.post(
    API_URL + "/api/tierlists/" + tierListId + "/comments",
    { content: content },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
}

export function updateComment(commentId, content) {
  const token = localStorage.getItem("authToken");

  return axios.put(
    API_URL + "/api/comments/" + commentId,
    { content: content },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
}

export function deleteComment(commentId) {
  const token = localStorage.getItem("authToken");

  return axios.delete(API_URL + "/api/comments/" + commentId, {
    headers: { Authorization: "Bearer " + token },
  });
}
