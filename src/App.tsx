import { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import SearchBar from "./components/searchbar";
import Landing from "./components/landing";
import Navbar from "./components/navbar";
import Feed from "./components/feed";
import { useSearchParams } from "react-router-dom";

// Consider importing a LoginForm component to handle logging in the user.
// import LoginForm from "./components/LoginForm";

import { getFirestore, doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

import { normalFeaturesObjectToFirebaseFeaturesObject } from "./utils/firestoreObjectSerialization";
import Swal from "sweetalert2";
import { useAuth } from "./utils/authContext";
import loadMapDataToIframe from "./utils/loadMapDataToIframe";

function App() {
  const iframeRef = useRef<HTMLIFrameElement>(document.createElement("iframe"));

  window.onmessage = function (e) {
    if (e.data.call === "exportMapState") {
      console.log("e.data.value", e.data.value);
      handleUpload(e.data.value);
    }
  };

  const db = getFirestore();

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const browserUuid = searchParams.get("uuid");

    if (browserUuid) {
      loadMapDataToIframe(browserUuid, iframeRef);
    } else {
      console.log("NO UUID");
    }
  }, []);

  const { currentUser } = useAuth();

  const handleUpload = (mapState: object) => {
    console.log("shapes before", mapState);
    mapState.shapes = normalFeaturesObjectToFirebaseFeaturesObject(
      mapState.shapes
    );
    console.log("formattedShapes", mapState);

    const mapUUID = nanoid(8);
    const mapDocRef = doc(db, "maps", mapUUID);
    setDoc(mapDocRef, mapState, { merge: true })
      .then(() => {
        console.log("Document successfully written!");
        Swal.fire({
          title: "Upload Successful",
          html: `
          Here is the sharable link for your map: 
          <a style="color: #60a5fa;" href=${
            import.meta.env.VITE_HOST
          }/#${mapUUID}>
            ${import.meta.env.VITE_HOST}/#${mapUUID}
          </a>
          `,
          icon: "success",
        });
      })
      .catch((error) => console.error("Error writing document: ", error));

    // if user logged in, then post
    if (currentUser) {
      const postUUID = nanoid(8);
      const postData = {
        mapId: mapUUID,
        username: currentUser.displayName,
        comments: [],
        likes: [], // will be filled with userIds
        createdAt: new Date(),
        profilePicUrl: currentUser.photoURL,
        title: "Awesome Title",
        description: "Awesome Description",
      };
      const postDocRef = doc(db, "posts", postUUID);
      setDoc(postDocRef, postData, { merge: true })
        .then(() => {
          console.log("Post successfully written!");
        })
        .catch((error) => console.error("Error writing Post: ", error));
    }

    setSearchParams({ uuid: mapUUID });
  };

  return (
    <>

      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
            <Landing/>
              <SearchBar iframeRef={iframeRef} />
              <iframe
                ref={iframeRef}
                style={{ width: "100%", height: "500px" }}
                src="editMap.html"
              />
            </>
          }
        />
        <Route
          path="/map"
          element={
            <>
              <SearchBar iframeRef={iframeRef} />
              <iframe
                ref={iframeRef}
                style={{ width: "100%", height: "500px" }}
                src="editMap.html"
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
