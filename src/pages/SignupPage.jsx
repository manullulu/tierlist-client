import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth.api";

function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    signup(email, password, name, avatar)
      .then(() => {
        // Le compte est créé : on envoie l'utilisateur se connecter
        navigate("/login");
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("L'inscription a échoué.");
        }
      });
  };

  return (
    <div className="page page-narrow">
      <h1>Inscription</h1>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Nom
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

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
            minLength={6}
            required
          />
        </label>

        <label>
          Avatar (URL d'une image, facultatif)
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://..."
          />
        </label>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="btn btn-primary">
          Créer mon compte
        </button>
      </form>

      <p className="form-footer">
        Déjà un compte ? <Link to="/login">Connexion</Link>
      </p>
    </div>
  );
}

export default SignupPage;
