import { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBar from "./components/searchbar";
import LoginPage from "./components/login";

function App() {
  const iframeRef = useRef<HTMLIFrameElement>(document.createElement("iframe"));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={
          <>
            <SearchBar iframeRef={iframeRef} />
            <iframe
              ref={iframeRef}
              style={{ width: "100%", height: "500px" }}
              src="map.html"
            />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;