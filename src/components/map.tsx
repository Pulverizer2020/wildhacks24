import { MapContainer, TileLayer, useMap } from 'react-leaflet';

function MyComponent({ locationInfo }) {
  const map = useMap();
  const defaultCenter = [51.505, -0.09]; // Default center
  const center = locationInfo ? [locationInfo.lat, locationInfo.lon] : defaultCenter;

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
      <MapContainer center={defaultCenter} zoom={zoomLevel} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MyComponent locationInfo={locationInfo} />
      </MapContainer>
    );
  }
};

export default Map;
