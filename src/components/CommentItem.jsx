import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

// Un commentaire, avec les boutons Modifier / Supprimer selon les droits
function CommentItem(props) {
  const comment = props.comment;

  const { user } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  let isAuthor = false;
  let isAdmin = false;

  if (user) {
    if (user._id === comment.author._id) {
      isAuthor = true;
    }
    if (user.role === "admin") {
      isAdmin = true;
    }
  }

  const date = new Date(comment.createdAt).toLocaleString("en-US");

  const handleSave = (e) => {
    e.preventDefault();
    props.onUpdate(comment._id, editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <div className="comment-author">
          {comment.author.avatar ? (
            <img src={comment.author.avatar} alt={comment.author.name} className="avatar avatar-small" />
          ) : (
            <div className="avatar avatar-small avatar-placeholder">
              {comment.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <Link to={"/users/" + comment.author._id}>{comment.author.name}</Link>
        </div>
        <span className="comment-date">{date}</span>
      </div>

      {!isEditing && <p className="comment-content">{comment.content}</p>}

      {isEditing && (
        <form onSubmit={handleSave} className="comment-edit-form">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            maxLength={500}
            rows={3}
            required
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-small">
              Save
            </button>
            <button type="button" className="btn btn-secondary btn-small" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {!isEditing && (isAuthor || isAdmin) && (
        <div className="comment-actions">
          {isAuthor && (
            <button type="button" className="btn-link" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
          <button
            type="button"
            className="btn-link btn-link-danger"
            onClick={() => props.onDelete(comment._id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentItem;
