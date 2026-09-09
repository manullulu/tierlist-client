import { Routes, Route } from "react-router-dom";

import Footer from "./components/Footer";

import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <div className="app">
      <main className="app-content">
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
