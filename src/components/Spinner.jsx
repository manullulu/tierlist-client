import { ClipLoader } from "react-spinners";

// Le rond qui tourne pendant qu'une page charge ses données (bibliothèque react-spinners)
function Spinner() {
  return (
    <div className="spinner" role="status">
      <ClipLoader color="#0b57d0" size={26} />
      <span className="spinner-text">Loading...</span>
    </div>
  );
}

export default Spinner;
