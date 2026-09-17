import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { getUserTierLists, deleteTierList } from "../api/tierlists.api";
import TierListCard from "../components/TierListCard";
import Spinner from "../components/Spinner";

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
        setErrorMessage("Could not load your tier lists.");
        setIsLoading(false);
      });
  }, [user]);

  const handleDelete = (tierListId) => {
    const confirmed = window.confirm("Delete this tier list permanently?");
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
        setErrorMessage("Deleting failed.");
      });
  };

  if (!user) {
    return <Spinner />;
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
          + New tier list
        </Link>
      </header>

      <h2>My tier lists ({tierLists.length})</h2>

      {isLoading && <Spinner />}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!isLoading && tierLists.length === 0 && (
        <p className="empty-state">
          You don't have any tier list yet. <Link to="/create">Create the first one!</Link>
        </p>
      )}

      <div className="tierlist-grid">
        {tierLists.map((tierList) => {
          return (
            <div key={tierList._id} className="tierlist-card-wrapper">
              <TierListCard tierList={tierList} />

              <div className="tierlist-card-actions">
                <Link to={"/tierlists/" + tierList._id + "/edit"} className="btn btn-secondary btn-small">
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn btn-danger btn-small"
                  onClick={() => handleDelete(tierList._id)}
                >
                  Delete
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
