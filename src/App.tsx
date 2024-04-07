import { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import SearchBar from "./components/searchbar";
import Landing from "./components/landing";
import Navbar from "./components/navbar";
import Feed from "./components/feed";
import { useSearchParams } from "react-router-dom";

// Consider importing a LoginForm component to handle logging in the user.
// import LoginForm from "./components/LoginForm";

import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";
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

  const submitPost = (title: string, description: string, postId: string) => {
    console.log("title and description: " + title + " " + description);

    const mapDocRef = doc(db, "posts", postId);
    updateDoc(mapDocRef, {
      title: title,
      description: description,
    })
      .then(() => console.log("post title and description upload success!"))
      .catch((err) =>
        console.log("post title and description upload error", err)
      );
  };

  const handleUpload = (mapState: object) => {
    console.log("shapes before", mapState);
    mapState.shapes = normalFeaturesObjectToFirebaseFeaturesObject(
      mapState.shapes
    );
    console.log("formattedShapes", mapState);

    const postUUID = nanoid(8);

    const mapUUID = nanoid(8);
    const mapDocRef = doc(db, "maps", mapUUID);
    setDoc(mapDocRef, mapState, { merge: true })
      .then(() => {
        console.log("Document successfully written!");
        Swal.fire({
          title: "Upload Successful",
          confirmButtonText: "Submit",
          html: `
          Here is the sharable link for your map: 
          <a style="color: #60a5fa;" href=${import.meta.env.VITE_HOST
            }/#${mapUUID}>
            ${import.meta.env.VITE_HOST}/map?uuid=${mapUUID}
          </a>

          ${currentUser
              ? `
              <br />
              <br />

               Add a title and description for your post?

               <input type="text" id="title" class="swal2-input" placeholder="Title">
               <input type="text" id="description" class="swal2-input" placeholder="Description">
          `
              : ""
            }
          `,
          icon: "success",
          preConfirm: () => {
            if (currentUser) {
              const title =
                (document.getElementById("title") as HTMLInputElement)?.value ||
                "";
              const description =
                (document.getElementById("description") as HTMLInputElement)
                  ?.value || "";
              return { title, description };
            } else {
              return {};
            }
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const { title, description } = result.value;
            if (title && description) {
              submitPost(title, description, postUUID);
            }
          }
        });
      })
      .catch((error) => console.error("Error writing document: ", error));

    // if user logged in, then post
    if (currentUser) {
      const postData = {
        mapId: mapUUID,
        username: currentUser.displayName,
        comments: [],
        likes: [], // will be filled with userIds
        createdAt: new Date(),
        profilePicUrl: currentUser.photoURL,
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
              <Landing />
              <SearchBar iframeRef={iframeRef} />
              <iframe
                ref={iframeRef}
                style={{ width: "100%", height: "500px" }}
                src="editMap.html"
              />
              <div className="h-20"></div>
            </>
          }
        />
        <Route
          path="/map"
          element={
            <>
              <div className="mt-20"></div>
              <SearchBar iframeRef={iframeRef} />
              <iframe
                ref={iframeRef}
                style={{ width: "100%", height: "500px" }}
                src="editMap.html"
              />
              <div className="h-20"></div>
            </>
          }
        />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </>
  );
}

export default App;
