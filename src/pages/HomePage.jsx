import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllTierLists } from "../api/tierlists.api";
import TierListCard from "../components/TierListCard";
import Spinner from "../components/Spinner";

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
        setErrorMessage("Could not load the tier lists.");
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
        <div className="hero-text">
          <h1>Rank your favorite video games</h1>
          <p>
            Create your tier list, place your games from S to F, share it and vote for the
            rankings of other players.
          </p>
          <Link to="/create" className="btn btn-primary">
            Create my tier list
          </Link>
        </div>

        <img src="/illustration.jpg" alt="TierList logo on a phone screen" className="hero-image" />
      </section>

      <section className="toolbar">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search a tier list..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>

        <label className="sort-select">
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recent">Newest</option>
            <option value="popular">Most popular</option>
          </select>
        </label>
      </section>

      {isLoading && <Spinner />}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {!isLoading && !errorMessage && tierLists.length === 0 && (
        <p className="empty-state">No tier list found. Be the first to create one!</p>
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
