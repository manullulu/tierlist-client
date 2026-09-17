import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { getTierList, deleteTierList } from "../api/tierlists.api";
import { getComments, addComment, updateComment, deleteComment } from "../api/comments.api";
import TierRow from "../components/TierRow";
import VoteButtons from "../components/VoteButtons";
import CommentItem from "../components/CommentItem";

function TierListDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext);

  const [tierList, setTierList] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    getTierList(id)
      .then((response) => {
        setTierList(response.data);
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

    getComments(id)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleDeleteTierList = () => {
    const confirmed = window.confirm("Delete this tier list permanently?");
    if (!confirmed) {
      return;
    }

    deleteTierList(id)
      .then(() => {
        navigate("/profile");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Deleting failed.");
      });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    setCommentError("");

    addComment(id, newComment)
      .then((response) => {
        // Le nouveau commentaire arrive en premier
        setComments([response.data, ...comments]);
        setNewComment("");
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setCommentError(error.response.data.message);
        } else {
          setCommentError("Could not add the comment.");
        }
      });
  };

  const handleUpdateComment = (commentId, content) => {
    updateComment(commentId, content)
      .then((response) => {
        const updatedComments = comments.map((comment) => {
          if (comment._id === commentId) {
            return response.data;
          }
          return comment;
        });
        setComments(updatedComments);
      })
      .catch((error) => {
        console.log(error);
        setCommentError("Editing the comment failed.");
      });
  };

  const handleDeleteComment = (commentId) => {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) {
      return;
    }

    deleteComment(commentId)
      .then(() => {
        const remainingComments = comments.filter((comment) => comment._id !== commentId);
        setComments(remainingComments);
      })
      .catch((error) => {
        console.log(error);
        setCommentError("Deleting the comment failed.");
      });
  };

  if (isLoading) {
    return <p className="loading">Loading...</p>;
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

  // Est-ce que l'utilisateur connecté peut modifier / supprimer cette liste ?
  let canEdit = false;
  if (user) {
    if (user._id === tierList.owner._id) {
      canEdit = true;
    }
    if (user.role === "admin") {
      canEdit = true;
    }
  }

  const unrankedItems = tierList.items.filter((item) => item.tier === "unranked");

  const date = new Date(tierList.createdAt).toLocaleDateString("en-US");

  return (
    <div className="page">
      <header className="detail-header">
        <div>
          <h1>{tierList.title}</h1>
          {tierList.description && <p className="detail-description">{tierList.description}</p>}
          <p className="detail-meta">
            by <Link to={"/users/" + tierList.owner._id}>{tierList.owner.name}</Link> · {date} ·{" "}
            {tierList.items.length} games
            {!tierList.isPublic && <span className="badge badge-private">Private</span>}
          </p>
        </div>

        <div className="detail-actions">
          <VoteButtons tierListId={tierList._id} votes={tierList.votes} />

          {canEdit && (
            <div className="form-actions">
              <Link to={"/tierlists/" + tierList._id + "/edit"} className="btn btn-secondary btn-small">
                Edit
              </Link>
              <button type="button" className="btn btn-danger btn-small" onClick={handleDeleteTierList}>
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="tier-board">
        {tierList.tiers.map((tier) => {
          const itemsInThisTier = tierList.items.filter((item) => item.tier === tier.label);

          return (
            <TierRow
              key={tier.label}
              label={tier.label}
              color={tier.color}
              items={itemsInThisTier}
            />
          );
        })}

        {unrankedItems.length > 0 && (
          <TierRow
            label="?"
            color="#d1d5db"
            items={unrankedItems}
          />
        )}
      </section>

      <section className="comments-section">
        <h2>Comments ({comments.length})</h2>

        {isLoggedIn && (
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              placeholder="Your opinion on this ranking..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={500}
              rows={3}
              required
            />
            <div className="comment-form-footer">
              <span className="char-count">{newComment.length} / 500</span>
              <button type="submit" className="btn btn-primary btn-small">
                Post
              </button>
            </div>
          </form>
        )}

        {!isLoggedIn && (
          <p className="empty-state">
            <Link to="/login">Log in</Link> to leave a comment.
          </p>
        )}

        {commentError && <p className="error-message">{commentError}</p>}

        {comments.length === 0 && <p className="empty-state">No comments yet.</p>}

        {comments.map((comment) => {
          return (
            <CommentItem
              key={comment._id}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          );
        })}
      </section>
    </div>
  );
}

export default TierListDetailPage;
