/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getFirestore, doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

import Swal from "sweetalert2";
import { useAuth } from "../utils/authContext";
import loadMapDataToIframe from "../utils/loadMapDataToIframe";
import SearchBar from "./SearchBar";
import fetchAndFormatMapData from "../utils/fetchAndFormatMapData";
import { normalFeaturesObjectToFirebaseFeaturesObject } from "../utils/firestoreObjectSerialization";

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

      console.log("mapData, e.data.value", mapData, e.data.value);

      if (
        mapData &&
        mapData.mapState.shapes.features === e.data.value.shapes.features
      ) {
        Swal.fire({
          title: "You can't create a duplicate map!",
          text: "Try making some changes to the map by using the buttons on the left!",
          icon: "info",
        });
        return;
      }

      console.log("MADE IT TO HERE");

      handleUploadButton(e.data.value);
    }
  };

  const db = getFirestore();

  const [searchParams, setSearchParams] = useSearchParams();

  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    const getPostAndMapDataFromDB = async () => {
      const browserMapUuid = searchParams.get("uuid");

      if (browserMapUuid) {
        const loadedMapData = await fetchAndFormatMapData(browserMapUuid);
        setMapData(loadedMapData);

        const { mapState } = loadedMapData;

        loadMapDataToIframe(mapState, iframeRef);
      } else {
        console.log("NO POST UUID");
      }
    };

    getPostAndMapDataFromDB();
  }, []);

  const { currentUser } = useAuth();

  const submitToDB = (title: string, description: string, mapState: object) => {
    console.log("title and description: " + title + " " + description);
    console.log("shapes before", mapState);
    mapState.shapes = normalFeaturesObjectToFirebaseFeaturesObject(
      mapState.shapes
    );
    console.log("formattedShapes", mapState);

    // upload map
    const mapUUID = nanoid(8);
    const mapDocRef = doc(db, "maps", mapUUID);
    const mapData = {
      mapId: mapUUID,
      mapState: mapState,
      username: currentUser ? currentUser.displayName : "Anonymous",
      userId: currentUser ? currentUser.uid : "",
      profilePicUrl: currentUser ? currentUser.photoURL : "",
      title: title,
      description: description,
      comments: [],
      likes: [], // will be filled with userIds
      createdAt: new Date(),
    };

    setDoc(mapDocRef, mapData, { merge: true })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => console.error("Error writing document: ", error));

    setSearchParams({ uuid: mapUUID });

    Swal.fire({
      title: "Upload Successful",
      confirmButtonText: "Ok!",
      icon: "success",
      html: `
          Here is the sharable link for your map: 
          <a style="color: #60a5fa;" href=${
            import.meta.env.VITE_HOST
          }/map?uuid=${mapUUID}>
            ${import.meta.env.VITE_HOST}/map?uuid=${mapUUID}
          </a>
      `,
    });
  };

  const handleUploadButton = (mapState: object) => {
    Swal.fire({
      title: "Create a title & description for your map",
      confirmButtonText: "Submit",
      html: `

          <input type="text" id="title" class="swal2-input" placeholder="Title">
          <input type="text" id="description" class="swal2-input" placeholder="Description">    
             
          `,
      preConfirm: () => {
        const title =
          (document.getElementById("title") as HTMLInputElement)?.value || "";
        const description =
          (document.getElementById("description") as HTMLInputElement)?.value ||
          "";

        console.log("title, description:::::", title, description);
        return { title, description };
      },
    }).then((result) => {
      console.log("result", result);
      if (result.isConfirmed) {
        const { title, description } = result.value;
        if (title) {
          submitToDB(title, description, mapState);
        } else {
          Swal.fire({ title: "Please add a title!", icon: "info" });
        }
      }
    });
  };

  return (
    <>
      <SearchBar iframeRef={iframeRef} />
      {mapData && mapData?.createdAt && (
        <div className="ml-10 mb-2">
          <h2 className="text-4xl">{mapData?.title}</h2>
          <p className="text-lg">{mapData?.description}</p>
          <p className="text-xs">
            Created On: {mapData?.createdAt.toDate().toLocaleDateString()}
          </p>
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
