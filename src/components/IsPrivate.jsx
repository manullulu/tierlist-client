import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

// Protège une page : il faut être connecté pour la voir
function IsPrivate(props) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <p className="loading">Chargement...</p>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return props.children;
}

export default IsPrivate;
