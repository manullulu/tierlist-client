import { useState, useEffect, useContext } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { AuthContext } from "../context/auth.context";
import { getTierList, updateTierList } from "../api/tierlists.api";
import { addItem, updateItem, deleteItem } from "../api/items.api";
import { searchGames } from "../api/games.api";
import EditorTierRow from "../components/EditorTierRow";
import GameCard from "../components/GameCard";

// L'éditeur : recherche de jeux via RAWG + placement dans les rangs
// par glisser-déposer (dnd-kit) ou avec les menus déroulants et les boutons.
function EditTierListPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  // Le glissement ne démarre qu'après 8 pixels de mouvement :
  // un simple clic sur une tuile ne déclenche donc pas de glisser-déposer.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // La tier list et ses jeux
  const [tierList, setTierList] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // La recherche de jeux
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Le formulaire des paramètres (titre, description, rangs...)
  const [showSettings, setShowSettings] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [tiers, setTiers] = useState([]);
  const [settingsMessage, setSettingsMessage] = useState("");

  useEffect(() => {
    getTierList(id)
      .then((response) => {
        setTierList(response.data);
        setItems(response.data.items);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setIsPublic(response.data.isPublic);
        setTiers(response.data.tiers);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Could not load this tier list.");
        }
        setIsLoading(false);
      });
  }, [id]);

  // ---------- Recherche RAWG ----------

  const handleSearch = (e) => {
    e.preventDefault();

    if (query.trim() === "") {
      return;
    }

    setIsSearching(true);
    setSearchError("");

    searchGames(query)
      .then((response) => {
        setSearchResults(response.data);
        setIsSearching(false);
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setSearchError(error.response.data.message);
        } else {
          setSearchError("The search failed.");
        }
        setIsSearching(false);
      });
  };

  // ---------- Gestion des jeux ----------

  const handleAddGame = (game) => {
    setErrorMessage("");

    addItem(id, game.gameId, game.name, game.image, "unranked")
      .then((response) => {
        setItems([...items, response.data]);
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Could not add this game.");
        }
      });
  };

  const handleChangeTier = (itemId, newTier) => {
    setErrorMessage("");

    updateItem(id, itemId, newTier, undefined)
      .then((response) => {
        const updatedItems = items.map((item) => {
          if (item._id === itemId) {
            return response.data;
          }
          return item;
        });
        setItems(updatedItems);
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Could not change the rank.");
        }
      });
  };

  const handleRemoveGame = (itemId) => {
    setErrorMessage("");

    deleteItem(id, itemId)
      .then(() => {
        const remainingItems = items.filter((item) => item._id !== itemId);
        setItems(remainingItems);
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Could not remove this game.");
        }
      });
  };

  // Déplace un jeu d'une case vers la gauche ou la droite dans son rang.
  // direction vaut -1 (gauche) ou 1 (droite).
  const moveItem = (itemId, direction) => {
    setErrorMessage("");

    // On retrouve le jeu et ses voisins du même rang, triés par position
    const movedItem = items.find((item) => item._id === itemId);
    if (!movedItem) {
      return;
    }

    const sameTierItems = items
      .filter((item) => item.tier === movedItem.tier)
      .sort((a, b) => a.position - b.position);

    const currentIndex = sameTierItems.findIndex((item) => item._id === itemId);
    const neighborIndex = currentIndex + direction;

    if (neighborIndex < 0 || neighborIndex >= sameTierItems.length) {
      return;
    }

    const neighborItem = sameTierItems[neighborIndex];

    // Les deux jeux échangent leur position : on renumérote proprement
    const newPositionForMoved = neighborIndex;
    const newPositionForNeighbor = currentIndex;

    updateItem(id, movedItem._id, undefined, newPositionForMoved)
      .then(() => {
        return updateItem(id, neighborItem._id, undefined, newPositionForNeighbor);
      })
      .then(() => {
        const updatedItems = items.map((item) => {
          if (item._id === movedItem._id) {
            return { ...item, position: newPositionForMoved };
          }
          if (item._id === neighborItem._id) {
            return { ...item, position: newPositionForNeighbor };
          }
          return item;
        });
        setItems(updatedItems);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Moving the game failed.");
      });
  };

  // Quand on lâche une tuile après l'avoir glissée.
  // event.active est la tuile, event.over la ligne au-dessus de laquelle on l'a lâchée.
  const handleDragEnd = (event) => {
    const itemId = event.active.id;
    const dropZone = event.over;

    // Lâchée en dehors de toute ligne : on ne fait rien
    if (!dropZone) {
      return;
    }

    // L'identifiant de la ligne est "tier-S" : on enlève "tier-" pour retrouver le rang
    const newTier = dropZone.id.replace("tier-", "");

    const movedItem = items.find((item) => item._id === itemId);

    if (!movedItem) {
      return;
    }

    // Lâchée sur sa propre ligne : rien à changer
    if (movedItem.tier === newTier) {
      return;
    }

    handleChangeTier(itemId, newTier);
  };

  const handleMoveLeft = (itemId) => {
    moveItem(itemId, -1);
  };

  const handleMoveRight = (itemId) => {
    moveItem(itemId, 1);
  };

  // ---------- Paramètres de la tier list ----------

  const handleTierLabelChange = (index, newLabel) => {
    const updatedTiers = tiers.map((tier, i) => {
      if (i === index) {
        return { label: newLabel, color: tier.color };
      }
      return tier;
    });
    setTiers(updatedTiers);
  };

  const handleTierColorChange = (index, newColor) => {
    const updatedTiers = tiers.map((tier, i) => {
      if (i === index) {
        return { label: tier.label, color: newColor };
      }
      return tier;
    });
    setTiers(updatedTiers);
  };

  const handleAddTier = () => {
    setTiers([...tiers, { label: "New", color: "#cccccc" }]);
  };

  const handleRemoveTier = (index) => {
    if (tiers.length <= 2) {
      setSettingsMessage("You need at least two ranks.");
      return;
    }
    const remainingTiers = tiers.filter((tier, i) => i !== index);
    setTiers(remainingTiers);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsMessage("");

    const labels = [];
    for (let i = 0; i < tiers.length; i++) {
      const label = tiers[i].label.trim();
      if (label === "") {
        setSettingsMessage("Each rank needs a name.");
        return;
      }
      if (labels.includes(label)) {
        setSettingsMessage("Two ranks cannot have the same name.");
        return;
      }
      labels.push(label);
    }

    updateTierList(id, title, description, isPublic, tiers)
      .then((response) => {
        setTierList(response.data);
        setTiers(response.data.tiers);

        // Si un rang a été supprimé, les jeux qu'il contenait repassent en "non classé"
        const updatedItems = items.map((item) => {
          if (item.tier !== "unranked" && !labels.includes(item.tier)) {
            return { ...item, tier: "unranked" };
          }
          return item;
        });
        setItems(updatedItems);

        setSettingsMessage("Changes saved.");
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setSettingsMessage(error.response.data.message);
        } else {
          setSettingsMessage("Saving failed.");
        }
      });
  };

  // ---------- Affichage ----------

  if (isLoading) {
    return <p className="loading">Loading...</p>;
  }

  if (errorMessage && !tierList) {
    return (
      <div className="page">
        <p className="error-message">{errorMessage}</p>
        <Link to="/" className="btn btn-secondary">
          Back to home
        </Link>
      </div>
    );
  }

  // Seul le propriétaire (ou un admin) peut ouvrir l'éditeur
  let canEdit = false;
  if (user) {
    if (user._id === tierList.owner._id) {
      canEdit = true;
    }
    if (user.role === "admin") {
      canEdit = true;
    }
  }

  if (!canEdit) {
    return <Navigate to={"/tierlists/" + id} />;
  }

  // Les identifiants RAWG déjà dans la liste, pour griser le bouton "Ajouter"
  const addedGameIds = items.map((item) => item.gameId);

  const unrankedItems = items
    .filter((item) => item.tier === "unranked")
    .sort((a, b) => a.position - b.position);

  return (
    <div className="page">
      <header className="detail-header">
        <div>
          <h1>{tierList.title}</h1>
          <p className="detail-meta">Editor · {items.length} games</p>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? "Close settings" : "Settings"}
          </button>
          <Link to={"/tierlists/" + id} className="btn btn-primary btn-small">
            View the tier list
          </Link>
        </div>
      </header>

      {showSettings && (
        <form onSubmit={handleSaveSettings} className="form settings-form">
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={2}
            />
          </label>

          <label className="checkbox-label">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            Public tier list
          </label>

          <fieldset className="tiers-editor">
            <legend>Ranks</legend>

            {tiers.map((tier, index) => {
              return (
                <div key={index} className="tier-editor-row">
                  <input
                    type="color"
                    value={tier.color}
                    onChange={(e) => handleTierColorChange(index, e.target.value)}
                    title="Rank color"
                  />
                  <input
                    type="text"
                    value={tier.label}
                    onChange={(e) => handleTierLabelChange(index, e.target.value)}
                    maxLength={12}
                    required
                  />
                  <button
                    type="button"
                    className="btn-icon btn-icon-danger"
                    onClick={() => handleRemoveTier(index)}
                    title="Delete this rank"
                  >
                    ✕
                  </button>
                </div>
              );
            })}

            <button type="button" className="btn btn-secondary btn-small" onClick={handleAddTier}>
              + Add a rank
            </button>
          </fieldset>

          {settingsMessage && <p className="info-message">{settingsMessage}</p>}

          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </form>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="editor-layout">
        <section className="editor-board">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            {tiers.map((tier) => {
              const itemsInThisTier = items
                .filter((item) => item.tier === tier.label)
                .sort((a, b) => a.position - b.position);

              return (
                <EditorTierRow
                  key={tier.label}
                  label={tier.label}
                  color={tier.color}
                  tier={tier.label}
                  items={itemsInThisTier}
                  tiers={tiers}
                  onChangeTier={handleChangeTier}
                  onRemove={handleRemoveGame}
                  onMoveLeft={handleMoveLeft}
                  onMoveRight={handleMoveRight}
                />
              );
            })}

            <EditorTierRow
              label="?"
              color="#d1d5db"
              tier="unranked"
              items={unrankedItems}
              tiers={tiers}
              onChangeTier={handleChangeTier}
              onRemove={handleRemoveGame}
              onMoveLeft={handleMoveLeft}
              onMoveRight={handleMoveRight}
            />
          </DndContext>

          <p className="hint">
            Added games land in the "?" row (unranked). Grab a game by its picture and drop it on
            a row to rank it, or use the menu under each game. The arrows change the order
            inside a row.
          </p>
        </section>

        <aside className="editor-search">
          <h2>Add games</h2>

          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Zelda, Elden Ring, Mario..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary" disabled={isSearching}>
              {isSearching ? "..." : "Search"}
            </button>
          </form>

          {searchError && <p className="error-message">{searchError}</p>}

          {!isSearching && searchResults.length === 0 && !searchError && (
            <p className="empty-state">Search a game to add it to your list.</p>
          )}

          <div className="game-results">
            {searchResults.map((game) => {
              return (
                <GameCard
                  key={game.gameId}
                  game={game}
                  alreadyAdded={addedGameIds.includes(game.gameId)}
                  onAdd={handleAddGame}
                />
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default EditTierListPage;
