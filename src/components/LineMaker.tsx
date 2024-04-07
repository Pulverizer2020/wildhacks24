import { Polyline, useMapEvents } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { useState } from "react";

function LineMaker() {
  const [linePositions, setLinePositions] = useState<[number, number][]>([]);
  useMapEvents({
    click(e: LeafletMouseEvent) {
      setLinePositions((orig) => [...orig, [e.latlng.lat, e.latlng.lng]]);
    },
  });
  return linePositions === null ? null : <Polyline positions={linePositions} />;
}
export default LineMaker;
