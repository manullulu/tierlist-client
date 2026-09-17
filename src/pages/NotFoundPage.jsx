import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="page page-narrow not-found">
      <h1>404</h1>
      <p>This page does not exist... it is ranked F.</p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}

export default NotFoundPage;
