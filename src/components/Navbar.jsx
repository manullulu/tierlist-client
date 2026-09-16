import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        TierList
      </Link>

      <div className="navbar-links">
        <NavLink to="/" className="navbar-link">
          Accueil
        </NavLink>

        {isLoggedIn && (
          <NavLink to="/create" className="navbar-link">
            Créer
          </NavLink>
        )}

        {isLoggedIn && (
          <NavLink to="/profile" className="navbar-link">
            Mon profil
          </NavLink>
        )}

        {isLoggedIn && (
          <button className="btn btn-secondary btn-small" onClick={logOutUser}>
            Déconnexion
          </button>
        )}

        {isLoggedIn && user && <span className="navbar-user">Bonjour, {user.name}</span>}

        {!isLoggedIn && (
          <NavLink to="/login" className="navbar-link">
            Connexion
          </NavLink>
        )}

        {!isLoggedIn && (
          <NavLink to="/signup" className="btn btn-primary btn-small">
            Inscription
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
