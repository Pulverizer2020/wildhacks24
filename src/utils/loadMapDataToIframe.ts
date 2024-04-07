import { doc, getDoc, getFirestore } from "firebase/firestore";
import { firebaseFeaturesObjectToNormalFeaturesObject } from "./firestoreObjectSerialization";

const loadMapDataToIframe = (
  mapId: string,
  iframeRef: React.MutableRefObject<HTMLIFrameElement>
) => {
  const db = getFirestore();
  const docRef = doc(db, "maps", mapId);

  getDoc(docRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const loadedMapState = docSnapshot.data();

        loadedMapState.shapes = firebaseFeaturesObjectToNormalFeaturesObject(
          loadedMapState.shapes
        );

        console.log("formattedShapes", loadedMapState);

        // send this data to the map
        iframeRef.current.contentWindow?.postMessage({
          call: "loadMapState",
          value: loadedMapState,
        });
      } else {
        // Document doesn't exist
        console.log("DOCUMENT DOESN'T EXIST", mapId);
      }
    })
    .catch((error) => {
      console.error("Error fetching document: ", error);
    });
};

export default loadMapDataToIframe;
