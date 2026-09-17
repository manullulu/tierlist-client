// Une ligne de la tier list en lecture seule (page de détail) :
// la case colorée avec le rang, puis les jeux placés dedans.
function TierRow(props) {
  const label = props.label;
  const color = props.color;
  const items = props.items;

  return (
    <div className="tier-row">
      <div className="tier-label" style={{ backgroundColor: color }}>
        {label}
      </div>

      <div className="tier-items">
        {items.length === 0 && <span className="tier-empty">No games</span>}

        {items.map((item) => {
          return (
            <div key={item._id} className="game-tile">
              {item.gameImage ? (
                <img src={item.gameImage} alt={item.gameName} className="game-tile-image" />
              ) : (
                <div className="game-tile-image game-no-image">{item.gameName}</div>
              )}

              <div className="game-tile-name" title={item.gameName}>
                {item.gameName}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TierRow;
