import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SearchBar from "./components/searchbar";
import Navbar from "./components/navbar";
import Feed from "./components/feed";
import { User } from "firebase/auth";

// Consider importing a LoginForm component to handle logging in the user.
// import LoginForm from "./components/LoginForm";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { initializeApp } from "firebase/app";
import {
  firebaseFeaturesObjectToNormalFeaturesObject,
  normalFeaturesObjectToFirebaseFeaturesObject,
} from "./utils/firestoreObjectSerialization";

const config = {
  apiKey: "AIzaSyDrkCcTA-x2YRWDg9irkpp41YfJ7Nllo1U",
  authDomain: "wildhacks24-1108b.firebaseapp.com",
  databaseURL: "https://wildhacks24-1108b-default-rtdb.firebaseio.com",
  projectId: "wildhacks24-1108b",
  storageBucket: "wildhacks24-1108b.appspot.com",
  messagingSenderId: "282904899307",
  appId: "1:282904899307:web:b67dd6eb5ad1577abd98ae",
};
initializeApp(config);

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

  window.onmessage = function (e) {
    if (e.data.call === "exportMapShapes") {
      console.log("e.data.value", e.data.value);
      handleUpload(e.data.value);
    }
  };

  const [uuid, setUUID] = useState("");
  const db = getFirestore();

  useEffect(() => {
    const browserUuid = window.location.hash.substring(1);

    if (browserUuid) {
      const docRef = doc(db, "maps", browserUuid);

      getDoc(docRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const values = docSnapshot.data();

            const valuesFormatted =
              firebaseFeaturesObjectToNormalFeaturesObject(values);

            console.log("valuesFormatted", valuesFormatted);

            setUUID(browserUuid);

            // send this data to the map
            iframeRef.current.contentWindow?.postMessage({
              call: "loadMapShapes",
              value: valuesFormatted,
            });
          } else {
            // Document doesn't exist
            console.log("DOCUMENT DOESN'T EXIST", browserUuid);
          }
        })
        .catch((error) => {
          console.error("Error fetching document: ", error);
        });
    } else {
      console.log("NO UUID");
    }
  }, []);

  const handleUpload = (newFeatures: object) => {
    // Generate a small UUID and update state

    const smallUUID = nanoid(8);
    setUUID(smallUUID);

    const docRef = doc(db, "maps", smallUUID); // Replace "collectionName" with your actual collection name

    console.log("feature before", newFeatures);
    const formattedFeatures =
      normalFeaturesObjectToFirebaseFeaturesObject(newFeatures);
    console.log("formattedFeatures", formattedFeatures);

    setDoc(docRef, formattedFeatures, { merge: true })
      .then(() => console.log("Document successfully written!"))
      .catch((error) => console.error("Error writing document: ", error));
  };

  return (
    <Router>
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<RedirectToMap />} />
        <Route path="/map" element={
          <>
            <SearchBar iframeRef={iframeRef} />
            {uuid && <p>Your URL: http://localhost:5173/map?uuid={uuid}</p>}
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