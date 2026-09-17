// Le rond qui tourne pendant qu'une page charge ses données
function Spinner() {
  return (
    <div className="spinner" role="status">
      <div className="spinner-circle"></div>
      <span className="spinner-text">Loading...</span>
    </div>
  );
}

export default Spinner;
