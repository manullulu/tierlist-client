import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { voteForTierList, removeVote } from "../api/votes.api";

// Les boutons pouce en haut / pouce en bas d'une tier list
function VoteButtons(props) {
  const tierListId = props.tierListId;

  const [score, setScore] = useState(props.votes.score);
  const [upvotes, setUpvotes] = useState(props.votes.upvotes);
  const [downvotes, setDownvotes] = useState(props.votes.downvotes);
  const [myVote, setMyVote] = useState(props.votes.myVote);
  const [errorMessage, setErrorMessage] = useState("");

  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleVote = (value) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setErrorMessage("");

    // Si on reclique sur son vote actuel, on le retire
    if (myVote === value) {
      removeVote(tierListId)
        .then((response) => {
          setScore(response.data.score);
          setUpvotes(response.data.upvotes);
          setDownvotes(response.data.downvotes);
          setMyVote(response.data.myVote);
        })
        .catch((error) => {
          setErrorMessage(error.response ? error.response.data.message : "The vote failed.");
        });
      return;
    }

    voteForTierList(tierListId, value)
      .then((response) => {
        setScore(response.data.score);
        setUpvotes(response.data.upvotes);
        setDownvotes(response.data.downvotes);
        setMyVote(response.data.myVote);
      })
      .catch((error) => {
        setErrorMessage(error.response ? error.response.data.message : "The vote failed.");
      });
  };

  return (
    <div className="vote-buttons">
      <button
        type="button"
        className={myVote === 1 ? "btn-vote btn-vote-active-up" : "btn-vote"}
        onClick={() => handleVote(1)}
        title="This ranking is fair"
      >
        👍 {upvotes}
      </button>

      <span className="vote-score">{score > 0 ? "+" + score : score}</span>

      <button
        type="button"
        className={myVote === -1 ? "btn-vote btn-vote-active-down" : "btn-vote"}
        onClick={() => handleVote(-1)}
        title="Disagree with this ranking"
      >
        👎 {downvotes}
      </button>

      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
}

export default VoteButtons;
