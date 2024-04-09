/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

import { normalFeaturesObjectToFirebaseFeaturesObject } from "../utils/firestoreObjectSerialization";
import Swal from "sweetalert2";
import { useAuth } from "../utils/authContext";
import loadMapDataToIframe from "../utils/loadMapDataToIframe";
import SearchBar from "./SearchBar";
import fetchAndFormatMapData from "../utils/fetchAndFormatMapData";

function MapEditor() {
  const iframeRef = useRef<HTMLIFrameElement>(document.createElement("iframe"));

  window.onmessage = function (e) {
    if (e.data.call === "exportMapState") {
      console.log("e.data.value", e.data.value);

      // if no shapes are included, then don't upload
      if (e.data.value.shapes.features.length === 0) {
        Swal.fire({
          title: "You can't create a map without any features!",
          text: "Try addings some by using the buttons on the left!",
          icon: "info",
        });
        return;
      }

      handleUpload(e.data.value);
    }
  };

  const db = getFirestore();

  const [searchParams, setSearchParams] = useSearchParams();

  const [mapData, setMapData] = useState(null);
  useEffect(() => {
    const getMapDataFromDB = async () => {
      const browserUuid = searchParams.get("uuid");

      if (browserUuid) {
        const newMapData = await fetchAndFormatMapData(browserUuid);
        console.log("newMapData", newMapData);
        setMapData(newMapData);
        loadMapDataToIframe(newMapData, iframeRef);
      } else {
        console.log("NO UUID");
      }
    };

    getMapDataFromDB();
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
    setDoc(mapDocRef, { ...mapState, createdAt: new Date() }, { merge: true })
      .then(() => {
        console.log("Document successfully written!");
        Swal.fire({
          title: "Upload Successful",
          confirmButtonText: "Submit",
          html: `
          Here is the sharable link for your map: 
          <a style="color: #60a5fa;" href=${
            import.meta.env.VITE_HOST
          }/#${mapUUID}>
            ${import.meta.env.VITE_HOST}/map?uuid=${mapUUID}
          </a>

          ${
            currentUser
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
      <SearchBar iframeRef={iframeRef} />
      {mapData && mapData?.createdAt && (
        <div className="ml-10 mb-2">
          Created On: {mapData?.createdAt.toDate().toLocaleDateString()}
        </div>
      )}

      <iframe
        ref={iframeRef}
        style={{ width: "100%", height: "500px" }}
        src="editMap.html"
      />
    </>
  );
}

export default MapEditor;
