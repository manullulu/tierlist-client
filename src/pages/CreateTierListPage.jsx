import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTierList } from "../api/tierlists.api";

const defaultTiers = [
  { label: "S", color: "#FF7F7F" },
  { label: "A", color: "#FFBF7F" },
  { label: "B", color: "#FFDF7F" },
  { label: "C", color: "#FFFF7F" },
  { label: "D", color: "#BFFF7F" },
  { label: "F", color: "#7FFF7F" },
];

function CreateTierListPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [tiers, setTiers] = useState(defaultTiers);
  const [errorMessage, setErrorMessage] = useState("");

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
      setErrorMessage("You need at least two ranks.");
      return;
    }
    const remainingTiers = tiers.filter((tier, i) => i !== index);
    setTiers(remainingTiers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    // On vérifie que les labels ne sont pas vides et qu'il n'y a pas de doublon
    const labels = [];
    for (let i = 0; i < tiers.length; i++) {
      const label = tiers[i].label.trim();
      if (label === "") {
        setErrorMessage("Each rank needs a name.");
        return;
      }
      if (labels.includes(label)) {
        setErrorMessage("Two ranks cannot have the same name.");
        return;
      }
      labels.push(label);
    }

    createTierList(title, description, isPublic, tiers)
      .then((response) => {
        // Une fois la liste créée, on va directement dans l'éditeur pour ajouter des jeux
        navigate("/tierlists/" + response.data._id + "/edit");
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Creating the tier list failed.");
        }
      });
  };

  return (
    <div className="page page-narrow">
      <h1>New tier list</h1>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Best RPGs, Zelda games ranked..."
            maxLength={100}
            required
          />
        </label>

        <label>
          Description (optional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain your ranking in a few words"
            maxLength={500}
            rows={3}
          />
        </label>

        <label className="checkbox-label">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Make this tier list public
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

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="btn btn-primary">
          Create and add games
        </button>
      </form>
    </div>
  );
}

export default CreateTierListPage;
