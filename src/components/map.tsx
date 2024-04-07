import { MapContainer, TileLayer, useMap } from "react-leaflet";
import LineMaker from "./LineMaker";

function MapComponent({ locationInfo }) {
  const map = useMap();
  const defaultCenter = [51.505, -0.09]; // Default center
  const center = locationInfo
    ? [locationInfo.lat, locationInfo.lon]
    : defaultCenter;

  map.setZoom(15);
  map.setView(center, map.getZoom()); // Set new center without altering the zoom level

  return null; // This component doesn't render anything itself
}

const Map = ({ locationInfo }) => {
  const defaultCenter = [51.505, -0.09]; // Default center
  const zoomLevel = 13; // Default zoom level

  if (!locationInfo) {
    return <h1>Location not provided</h1>;
  } else {
    return (
      <MapContainer
        center={defaultCenter}
        zoom={zoomLevel}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          minZoom={0}
          maxZoom={18}
        />
        <MapComponent locationInfo={locationInfo} />
        <LineMaker />
      </MapContainer>
    );
  }
};

export default Map;
