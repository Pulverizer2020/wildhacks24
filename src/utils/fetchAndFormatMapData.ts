import { doc, getDoc, getFirestore } from "firebase/firestore";
import { firebaseFeaturesObjectToNormalFeaturesObject } from "./firestoreObjectSerialization";

const fetchAndFormatMapData = async (mapId: string) => {
  const db = getFirestore();
  const docRef = doc(db, "maps", mapId);

  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const mapData = docSnapshot.data();

      mapData.mapState.shapes = firebaseFeaturesObjectToNormalFeaturesObject(
        mapData.mapState.shapes
      );

      return mapData;
    } else {
      // Document doesn't exist
      console.log("DOCUMENT DOESN'T EXIST", mapId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
  }

  return null;
};

export default fetchAndFormatMapData;
