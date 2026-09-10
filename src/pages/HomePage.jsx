import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllTierLists } from "../api/tierlists.api";
import TierListCard from "../components/TierListCard";

function HomePage() {
  const [tierLists, setTierLists] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadTierLists = (searchValue, sortValue) => {
    setIsLoading(true);
    setErrorMessage("");

    getAllTierLists(searchValue, sortValue)
      .then((response) => {
        setTierLists(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Impossible de charger les tier lists.");
        setIsLoading(false);
      });
  };

  // Au premier affichage, et à chaque changement de tri
  useEffect(() => {
    loadTierLists(search, sort);
  }, [sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadTierLists(search, sort);
  };

  return (
    <div className="page">
      <section className="hero">
        <h1>Classe tes jeux vidéo préférés</h1>
        <p>
          Crée ta tier list, place tes jeux de S à F, partage-la et vote pour les classements
          des autres joueurs.
        </p>
        <Link to="/create" className="btn btn-primary">
          Créer ma tier list
        </Link>
      </section>

      <section className="toolbar">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Rechercher une tier list..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">
            Rechercher
          </button>
        </form>

        <label className="sort-select">
          Trier par
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recent">Plus récentes</option>
            <option value="popular">Plus populaires</option>
          </select>
        </label>
      </section>

      {isLoading && <p className="loading">Chargement...</p>}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!isLoading && !errorMessage && tierLists.length === 0 && (
        <p className="empty-state">Aucune tier list trouvée. Sois le premier à en créer une !</p>
      )}

      <div className="tierlist-grid">
        {tierLists.map((tierList) => {
          return <TierListCard key={tierList._id} tierList={tierList} />;
        })}
      </div>
    </div>
  );
}

export default HomePage;
