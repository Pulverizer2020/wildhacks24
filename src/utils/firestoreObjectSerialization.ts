/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// firestore objects can't have directly nested arrays

type NormalFeaturesObjectPartial = {
  features: {
    geometry: {
      coordinates: [number, number][][];
      type: "Polygon" | "LineString";
    };
  }[];
};
type FirebaseFeaturesObjectPartial = {
  features: {
    geometry: { coordinates: number[]; type: "Polygon" | "LineString" };
  }[];
};

// for map features
export const normalFeaturesObjectToFirebaseFeaturesObject = (
  normalFeaturesObject: NormalFeaturesObjectPartial
): FirebaseFeaturesObjectPartial => {
  const firebaseFeaturesObject: FirebaseFeaturesObjectPartial =
    normalFeaturesObject;

  for (let i = 0; i < firebaseFeaturesObject.features.length; i++) {
    firebaseFeaturesObject.features[i].geometry.coordinates =
      normalFeaturesObject.features[i].geometry.coordinates.flat(2);
  }

  return firebaseFeaturesObject;
};

// for map features
export const firebaseFeaturesObjectToNormalFeaturesObject = (
  firebaseFeaturesObject: FirebaseFeaturesObjectPartial
): NormalFeaturesObjectPartial => {
  const normalFeaturesObject: NormalFeaturesObjectPartial =
    firebaseFeaturesObject;

  for (let i = 0; i < normalFeaturesObject.features.length; i++) {
    normalFeaturesObject.features[i].geometry.coordinates = groupIntoPairs(
      firebaseFeaturesObject.features[i].geometry.coordinates
    );

    // add another layer of nested array
    if (normalFeaturesObject.features[i].geometry.type === "Polygon") {
      normalFeaturesObject.features[i].geometry.coordinates = [
        normalFeaturesObject.features[i].geometry.coordinates,
      ];
    }
  }

  return normalFeaturesObject;
};

function groupIntoPairs(numbers: number[]) {
  const pairs = [];
  for (let i = 0; i < numbers.length; i += 2) {
    pairs.push([numbers[i], numbers[i + 1]]);
  }
  return pairs;
}
