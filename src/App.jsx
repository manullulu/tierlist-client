import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";

import HomePage from "./pages/HomePage";
import TierListDetailPage from "./pages/TierListDetailPage";
import CreateTierListPage from "./pages/CreateTierListPage";
import EditTierListPage from "./pages/EditTierListPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/tierlists/:id" element={<TierListDetailPage />} />

          <Route
            path="/create"
            element={
              <IsPrivate>
                <CreateTierListPage />
              </IsPrivate>
            }
          />

          <Route
            path="/tierlists/:id/edit"
            element={
              <IsPrivate>
                <EditTierListPage />
              </IsPrivate>
            }
          />

          <Route
            path="/profile"
            element={
              <IsPrivate>
                <ProfilePage />
              </IsPrivate>
            }
          />

          <Route path="/users/:id" element={<UserProfilePage />} />

          <Route
            path="/signup"
            element={
              <IsAnon>
                <SignupPage />
              </IsAnon>
            }
          />

          <Route
            path="/login"
            element={
              <IsAnon>
                <LoginPage />
              </IsAnon>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
