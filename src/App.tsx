import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SearchBar from "./components/searchbar";
import Navbar from "./components/navbar";
import Feed from "./components/feed";
import { User } from "firebase/auth";

// Consider importing a LoginForm component to handle logging in the user.
// import LoginForm from "./components/LoginForm";

function App() {
  const iframeRef = useRef<HTMLIFrameElement>(document.createElement("iframe"));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load the user from localStorage when the app loads
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = () => {
    // Perform the login operation here.
    // After successful login, you have an object representing the user, which we'll simply represent as {}
    const user = { /* user data from successful login */ };

    // Save the user to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const handleLogout = () => {
    // Clear the user from localStorage
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<RedirectToMap />} />
        {/* Uncomment this when you have a LoginPage component ready */}
        {/* <Route path="/login" element={<LoginPage onLogin={handleLogin} />} /> */}
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
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
  );
}

function RedirectToMap() {
  let navigate = useNavigate();
  useEffect(() => {
    navigate('/map');
  }, []);
  return null;
}

export default App;