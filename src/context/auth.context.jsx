import { useState, useEffect, createContext } from "react";
import { verify } from "../api/auth.api";

const AuthContext = createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Enregistre le token dans le navigateur
  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  // Demande au serveur si le token stocké est encore valide
  const authenticateUser = () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      verify(storedToken)
        .then((response) => {
          const userFromToken = response.data;
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(userFromToken);
        })
        .catch(() => {
          // Token invalide ou expiré : on le supprime
          localStorage.removeItem("authToken");
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
        });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const logOutUser = () => {
    localStorage.removeItem("authToken");
    authenticateUser();
  };

  // Au chargement de l'application, on vérifie une fois le token
  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        isLoading: isLoading,
        user: user,
        storeToken: storeToken,
        authenticateUser: authenticateUser,
        logOutUser: logOutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
