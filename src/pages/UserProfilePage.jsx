import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUser } from "../api/users.api";
import { getUserTierLists } from "../api/tierlists.api";
import TierListCard from "../components/TierListCard";

// Le profil public d'un utilisateur : ses tier lists publiques
function UserProfilePage() {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [tierLists, setTierLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage("");

    getUser(id)
      .then((response) => {
        setProfile(response.data);
        return getUserTierLists(id);
      })
      .then((response) => {
        setTierLists(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Impossible de charger ce profil.");
        }
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <p className="loading">Chargement...</p>;
  }

  if (errorMessage) {
    return (
      <div className="page">
        <p className="error-message">{errorMessage}</p>
        <Link to="/" className="btn btn-secondary">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString("fr-FR");

  return (
    <div className="page">
      <header className="profile-header">
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.name} className="avatar avatar-large" />
        ) : (
          <div className="avatar avatar-large avatar-placeholder">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h1>{profile.name}</h1>
          <p className="detail-meta">
            Membre depuis le {memberSince}
            {profile.role === "admin" && <span className="badge badge-admin">Admin</span>}
          </p>
        </div>
      </header>

      <h2>Ses tier lists ({tierLists.length})</h2>

      {tierLists.length === 0 && <p className="empty-state">Aucune tier list publique.</p>}

      <div className="tierlist-grid">
        {tierLists.map((tierList) => {
          return <TierListCard key={tierList._id} tierList={tierList} />;
        })}
      </div>
    </div>
  );
}

export default UserProfilePage;
