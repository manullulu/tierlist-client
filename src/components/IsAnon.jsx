import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

// Page réservée aux visiteurs non connectés (login, signup)
function IsAnon(props) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <p className="loading">Chargement...</p>;
  }

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return props.children;
}

export default IsAnon;
