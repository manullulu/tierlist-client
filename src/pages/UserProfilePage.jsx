import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUser } from "../api/users.api";
import { getUserTierLists } from "../api/tierlists.api";
import TierListCard from "../components/TierListCard";
import Spinner from "../components/Spinner";

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
          setErrorMessage("Could not load this profile.");
        }
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <Spinner />;
  }

  if (errorMessage) {
    return (
      <div className="page">
        <p className="error-message">{errorMessage}</p>
        <Link to="/" className="btn btn-secondary">
          Back to home
        </Link>
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US");

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
            Member since {memberSince}
            {profile.role === "admin" && <span className="badge badge-admin">Admin</span>}
          </p>
        </div>
      </header>

      <h2>Tier lists ({tierLists.length})</h2>

      {tierLists.length === 0 && <p className="empty-state">No public tier list.</p>}

      <div className="tierlist-grid">
        {tierLists.map((tierList) => {
          return <TierListCard key={tierList._id} tierList={tierList} />;
        })}
      </div>
    </div>
  );
}

export default UserProfilePage;
