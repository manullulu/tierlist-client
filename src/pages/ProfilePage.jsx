import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { getUserTierLists, deleteTierList } from "../api/tierlists.api";
import TierListCard from "../components/TierListCard";

// Mes tier lists (publiques et privées), avec les boutons de gestion
function ProfilePage() {
  const { user } = useContext(AuthContext);

  const [tierLists, setTierLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    getUserTierLists(user._id)
      .then((response) => {
        setTierLists(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Impossible de charger tes tier lists.");
        setIsLoading(false);
      });
  }, [user]);

  const handleDelete = (tierListId) => {
    const confirmed = window.confirm("Supprimer définitivement cette tier list ?");
    if (!confirmed) {
      return;
    }

    deleteTierList(tierListId)
      .then(() => {
        const remainingTierLists = tierLists.filter((tierList) => tierList._id !== tierListId);
        setTierLists(remainingTierLists);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("La suppression a échoué.");
      });
  };

  if (!user) {
    return <p className="loading">Chargement...</p>;
  }

  return (
    <div className="page">
      <header className="profile-header">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="avatar avatar-large" />
        ) : (
          <div className="avatar avatar-large avatar-placeholder">{user.name.charAt(0).toUpperCase()}</div>
        )}

        <div>
          <h1>{user.name}</h1>
          <p className="detail-meta">
            {user.email}
            {user.role === "admin" && <span className="badge badge-admin">Admin</span>}
          </p>
        </div>

        <Link to="/create" className="btn btn-primary">
          + Nouvelle tier list
        </Link>
      </header>

      <h2>Mes tier lists ({tierLists.length})</h2>

      {isLoading && <p className="loading">Chargement...</p>}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!isLoading && tierLists.length === 0 && (
        <p className="empty-state">
          Tu n'as pas encore de tier list. <Link to="/create">Crée la première !</Link>
        </p>
      )}

      <div className="tierlist-grid">
        {tierLists.map((tierList) => {
          return (
            <div key={tierList._id} className="tierlist-card-wrapper">
              <TierListCard tierList={tierList} />

              <div className="tierlist-card-actions">
                <Link to={"/tierlists/" + tierList._id + "/edit"} className="btn btn-secondary btn-small">
                  Modifier
                </Link>
                <button
                  type="button"
                  className="btn btn-danger btn-small"
                  onClick={() => handleDelete(tierList._id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProfilePage;
