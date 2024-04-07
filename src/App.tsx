import { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBar from "./components/searchbar";
import Navbar from "./components/navbar";
import Feed from "./components/feed";
import { useSearchParams } from "react-router-dom";

// Consider importing a LoginForm component to handle logging in the user.
// import LoginForm from "./components/LoginForm";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

import {
  firebaseFeaturesObjectToNormalFeaturesObject,
  normalFeaturesObjectToFirebaseFeaturesObject,
} from "./utils/firestoreObjectSerialization";
import Swal from "sweetalert2";
import { AuthProvider } from "./utils/authContext";

function App() {
  const iframeRef = useRef<HTMLIFrameElement>(document.createElement("iframe"));

  window.onmessage = function (e) {
    if (e.data.call === "exportMapState") {
      console.log("e.data.value", e.data.value);
      handleUpload(e.data.value);
    }
  };

  const [uuid, setUUID] = useState("");
  const db = getFirestore();

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    // const browserUuid = window.location.hash.substring(1);
    const db = getFirestore();
    const browserUuid = searchParams.get("uuid");

    if (browserUuid) {
      const docRef = doc(db, "maps", browserUuid);

      getDoc(docRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const loadedMapState = docSnapshot.data();

            loadedMapState.shapes =
              firebaseFeaturesObjectToNormalFeaturesObject(
                loadedMapState.shapes
              );

            console.log("formattedShapes", loadedMapState);

            setUUID(browserUuid);

            // send this data to the map
            iframeRef.current.contentWindow?.postMessage({
              call: "loadMapState",
              value: loadedMapState,
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

  const handleUpload = (mapState: object) => {
    // Generate a small UUID and update state

    const smallUUID = nanoid(8);
    setUUID(smallUUID);

    const docRef = doc(db, "maps", smallUUID); // Replace "collectionName" with your actual collection name

    console.log("shapes before", mapState);
    mapState.shapes = normalFeaturesObjectToFirebaseFeaturesObject(
      mapState.shapes
    );
    console.log("formattedShapes", mapState);

    setDoc(docRef, mapState, { merge: true })
      .then(() => {
        console.log("Document successfully written!");
        Swal.fire({
          title: "Upload Successful",
          html: `
          Here is the sharable link for your map: 
          <a style="color: #60a5fa;" href=${
            import.meta.env.VITE_HOST
          }/#${smallUUID}>
            ${import.meta.env.VITE_HOST}/#${smallUUID}
          </a>
          `,
          icon: "success",
        });
      })
      .catch((error) => console.error("Error writing document: ", error));

    setSearchParams({ uuid: smallUUID });
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SearchBar iframeRef={iframeRef} />
              {uuid && (
                <p>
                  Your URL: {import.meta.env.VITE_HOST}/map?uuid={uuid}
                </p>
              )}
              <iframe
                ref={iframeRef}
                style={{ width: "100%", height: "500px" }}
                src="map.html"
              />
            </>
          }
        />
        <Route
          path="/map"
          element={
            <>
              <SearchBar iframeRef={iframeRef} />
              {uuid && (
                <p>
                  Your URL: {import.meta.env.VITE_HOST}/map?uuid={uuid}
                </p>
              )}
              <iframe
                ref={iframeRef}
                style={{ width: "100%", height: "500px" }}
                src="map.html"
              />
            </>
          }
        />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </>
  );
}

export default App;
