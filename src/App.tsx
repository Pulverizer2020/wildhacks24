import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import FeedPage from "./pages/FeedPage";
import LandingPage from "./pages/LandingPage";
import MapEditorPage from "./pages/MapEditorPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<MapEditorPage />} />
        <Route path="/feed" element={<FeedPage />} />
      </Routes>
    </>
  );
}

export default App;
