import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { login } from "../api/auth.api";

function LoginPage() {
  const navigate = useNavigate();
  const { storeToken, authenticateUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    login(email, password)
      .then((response) => {
        // On garde le token, puis on demande au contexte de recharger l'utilisateur
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("La connexion a échoué.");
        }
      });
  };

  return (
    <div className="page page-narrow">
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="btn btn-primary">
          Se connecter
        </button>
      </form>

      <p className="form-footer">
        Pas encore de compte ? <Link to="/signup">Inscription</Link>
      </p>
    </div>
  );
}

export default LoginPage;
