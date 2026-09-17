import { Link } from "react-router-dom";

// Carte d'aperçu d'une tier list (page d'accueil et profils)
function TierListCard(props) {
  const tierList = props.tierList;

  const date = new Date(tierList.createdAt).toLocaleDateString("en-US");

  return (
    <article className="tierlist-card">
      <div className="tierlist-card-colors">
        {tierList.tiers.map((tier) => {
          return <span key={tier.label} style={{ backgroundColor: tier.color }}></span>;
        })}
      </div>

      <Link to={"/tierlists/" + tierList._id} className="tierlist-card-preview">
        {tierList.previewItems.length === 0 && (
          <div className="tierlist-card-empty">No games yet</div>
        )}

        {tierList.previewItems.map((item) => {
          return (
            <div key={item._id} className="tierlist-card-preview-item">
              {item.gameImage ? (
                <img src={item.gameImage} alt={item.gameName} />
              ) : (
                <div className="game-no-image">{item.gameName}</div>
              )}
            </div>
          );
        })}
      </Link>

      <div className="tierlist-card-body">
        <Link to={"/tierlists/" + tierList._id} className="tierlist-card-title">
          {tierList.title}
        </Link>

        {tierList.description && (
          <p className="tierlist-card-description">{tierList.description}</p>
        )}

        <div className="tierlist-card-meta">
          <span>
            by{" "}
            <Link to={"/users/" + tierList.owner._id} className="tierlist-card-owner">
              {tierList.owner.name}
            </Link>
          </span>
          <span>{date}</span>
        </div>

        <div className="tierlist-card-stats">
          <span className="badge">{tierList.itemsCount} games</span>
          <span className={tierList.score >= 0 ? "badge badge-positive" : "badge badge-negative"}>
            {tierList.score > 0 ? "+" + tierList.score : tierList.score} votes
          </span>
          {!tierList.isPublic && <span className="badge badge-private">Private</span>}
        </div>
      </div>
    </article>
  );
}

export default TierListCard;
