import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import JSONCrush from 'jsoncrush'; // Import JSONCrush

const Map = () => {
  // Initialize state for map state (center coordinates and zoom)
  const [mapState, setMapState] = useState(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const uncrushedHash = JSONCrush.uncrush(decodeURIComponent(hash)); // Decompress and decode the hash
      const { center, zoom } = JSON.parse(uncrushedHash); // Parse the JSON string
      if (center && zoom !== undefined) {
        return { center, zoom };
      }
    }
    // Default to London if hash is not provided or invalid
    return { center: [51.505, -0.09], zoom: 13 };
  });

  // Effect to sync map state (center coordinates and zoom) with URL hash
  useEffect(() => {
    const compressedHash = JSONCrush.crush(JSON.stringify(mapState)); // Compress the state object to JSON string
    window.location.hash = encodeURIComponent(compressedHash); // Compress and encode the hash
  }, [mapState]);

  // Event handler to update map state (center and zoom) when the map is moved or zoomed
  const handleMove = (event) => {
    const { lat, lng } = event.target.getCenter();
    const zoom = event.target.getZoom();
    setMapState({ center: [lat, lng], zoom });
  };

  // Map event listener to update map state (center and zoom) when the map is moved or zoomed
  const MapEvents = () => {
    useMapEvent('move', handleMove);
    return null;
  };

  return (
    <MapContainer center={mapState.center} zoom={mapState.zoom} scrollWheelZoom={true}>
      <MapEvents />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={mapState.center}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
