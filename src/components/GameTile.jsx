import { useDraggable } from "@dnd-kit/core";

// Une tuile de jeu dans l'éditeur.
// On peut la glisser en l'attrapant par son image, ou utiliser le menu déroulant
// et les boutons en dessous (pratique sur mobile).
function GameTile(props) {
  const item = props.item;
  const tiers = props.tiers;
  const isFirst = props.isFirst;
  const isLast = props.isLast;

  // dnd-kit nous donne :
  // - setNodeRef : à mettre sur l'élément qui bouge
  // - listeners et attributes : à mettre sur la "poignée" que l'on attrape
  // - transform : le décalage de la souris pendant le glissement
  // - isDragging : vrai pendant qu'on glisse cette tuile
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item._id,
  });

  const style = {};
  if (transform) {
    style.transform = "translate(" + transform.x + "px, " + transform.y + "px)";
  }

  let className = "game-tile";
  if (isDragging) {
    className = "game-tile game-tile-dragging";
  }

  return (
    <div ref={setNodeRef} className={className} style={style}>
      <div className="game-tile-handle" {...listeners} {...attributes}>
        {item.gameImage ? (
          <img src={item.gameImage} alt={item.gameName} className="game-tile-image" draggable={false} />
        ) : (
          <div className="game-tile-image game-no-image">{item.gameName}</div>
        )}

        <div className="game-tile-name" title={item.gameName}>
          {item.gameName}
        </div>
      </div>

      <div className="game-tile-actions">
        <select
          value={item.tier}
          onChange={(e) => props.onChangeTier(item._id, e.target.value)}
          aria-label={"Rank of " + item.gameName}
        >
          <option value="unranked">Unranked</option>
          {tiers.map((tier) => {
            return (
              <option key={tier.label} value={tier.label}>
                {tier.label}
              </option>
            );
          })}
        </select>

        <div className="game-tile-buttons">
          <button
            type="button"
            className="btn-icon"
            onClick={() => props.onMoveLeft(item._id)}
            disabled={isFirst}
            title="Move left"
          >
            ◀
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={() => props.onMoveRight(item._id)}
            disabled={isLast}
            title="Move right"
          >
            ▶
          </button>
          <button
            type="button"
            className="btn-icon btn-icon-danger"
            onClick={() => props.onRemove(item._id)}
            title="Remove from the list"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameTile;
