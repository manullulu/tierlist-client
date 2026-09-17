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
          Home
        </NavLink>

        {isLoggedIn && (
          <NavLink to="/create" className="navbar-link">
            Create
          </NavLink>
        )}

        {isLoggedIn && (
          <NavLink to="/profile" className="navbar-link">
            My profile
          </NavLink>
        )}

        {isLoggedIn && (
          <button className="btn btn-secondary btn-small" onClick={logOutUser}>
            Log out
          </button>
        )}

        {isLoggedIn && user && <span className="navbar-user">Hi, {user.name}</span>}

        {!isLoggedIn && (
          <NavLink to="/login" className="navbar-link">
            Log in
          </NavLink>
        )}

        {!isLoggedIn && (
          <NavLink to="/signup" className="btn btn-primary btn-small">
            Sign up
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
