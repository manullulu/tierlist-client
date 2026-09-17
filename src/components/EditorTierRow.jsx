import { useDroppable } from "@dnd-kit/core";
import GameTile from "./GameTile";

// Une ligne de l'éditeur : la case colorée avec le rang, puis une zone
// dans laquelle on peut déposer des tuiles de jeu.
function EditorTierRow(props) {
  const label = props.label;
  const color = props.color;
  const tier = props.tier;
  const items = props.items;
  const tiers = props.tiers;

  // L'identifiant de la zone de dépôt : "tier-S", "tier-A"... ou "tier-unranked".
  // isOver est vrai quand une tuile est en train de survoler cette ligne.
  const { setNodeRef, isOver } = useDroppable({
    id: "tier-" + tier,
  });

  let className = "tier-items";
  if (isOver) {
    className = "tier-items tier-items-over";
  }

  return (
    <div className="tier-row">
      <div className="tier-label" style={{ backgroundColor: color }}>
        {label}
      </div>

      <div ref={setNodeRef} className={className}>
        {items.length === 0 && <span className="tier-empty">Drop a game here</span>}

        {items.map((item, index) => {
          return (
            <GameTile
              key={item._id}
              item={item}
              tiers={tiers}
              isFirst={index === 0}
              isLast={index === items.length - 1}
              onChangeTier={props.onChangeTier}
              onRemove={props.onRemove}
              onMoveLeft={props.onMoveLeft}
              onMoveRight={props.onMoveRight}
            />
          );
        })}
      </div>
    </div>
  );
}

export default EditorTierRow;
