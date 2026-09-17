// Résultat de recherche RAWG, avec un bouton pour l'ajouter à la tier list
function GameCard(props) {
  const game = props.game;
  const alreadyAdded = props.alreadyAdded;

  let year = "";
  if (game.released) {
    year = game.released.substring(0, 4);
  }

  return (
    <div className="game-card">
      {game.image ? (
        <img src={game.image} alt={game.name} className="game-card-image" />
      ) : (
        <div className="game-card-image game-no-image">No image</div>
      )}

      <div className="game-card-body">
        <div className="game-card-name">{game.name}</div>
        <div className="game-card-meta">
          {year && <span>{year}</span>}
          {game.rating > 0 && <span>★ {game.rating}</span>}
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary btn-small"
        onClick={() => props.onAdd(game)}
        disabled={alreadyAdded}
      >
        {alreadyAdded ? "Added" : "Add"}
      </button>
    </div>
  );
}

export default GameCard;
