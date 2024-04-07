import { useEffect, useRef, useState } from "react";
import SearchBar from "./components/searchbar";

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
    <>
      <SearchBar iframeRef={iframeRef} />
      {uuid && <p>Your URL: http://localhost:5173/#{uuid}</p>}

      <iframe
        ref={iframeRef}
        style={{ width: "100%", height: "500px" }}
        src="map.html"
      />
    </>
  );
}

export default App;
