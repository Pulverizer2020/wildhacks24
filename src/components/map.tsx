import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Polygon, Polyline, Popup } from 'react-leaflet';
import { Tooltip } from 'react-leaflet';

const Map = () => {
  const [buildingsData, setBuildingsData] = useState([]);
  const [roadsData, setRoadsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const overpassUrl = 'https://overpass-api.de/api/interpreter';
      const overpassQuery = `
        [out:json];
        (
          way["highway"](around:100,52.5200, 13.4050);
          node(w);
          way["building"](around:100,52.5200, 13.4050);
          node(w);
        );
        out body;
      `;

      const response = await axios.post(overpassUrl, overpassQuery, {
        headers: { 'Content-Type': 'text/plain' },
      });

      const buildings = [];
      const roads = [];

      console.log(response.data);

      response.data.elements.forEach((element) => {
        console.log('Current element:', element);

        if (element.type === 'way') {
          console.log('Element is of type "way"');

          const wayNodes = response.data.elements.filter((node) => node.type === 'node' && element.nodes.includes(node.id));
          console.log('Way nodes:', wayNodes);

          if (element.tags.building) {
            console.log('Element is a building');

            buildings.push({
              ...element,
              nodes: wayNodes.map(node => [node.lat, node.lon])
            });

            console.log('Buildings array:', buildings);
          } else if (element.tags.highway) {
            console.log('Element is a highway');

            roads.push({
              ...element,
              nodes: wayNodes.map(node => [node.lat, node.lon])
            });

            console.log('Roads array:', roads);
          }
        }
      });

      setBuildingsData(buildings);
      setRoadsData(roads);
    };

    fetchData();
  }, []);

  return (
    <>
      <MapContainer center={[52.5200, 13.4050]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {buildingsData.map((building, index) => (
          building.nodes && (
            <Polygon key={index} positions={building.nodes}>
              <Tooltip>
                <pre>{JSON.stringify(building, null, 2)}</pre>
              </Tooltip>
            </Polygon>
          )
        ))}
        {roadsData.map((road, index) => (
          road.nodes && (
            <Polyline key={index} positions={road.nodes}>
              <Tooltip>
                <pre>{JSON.stringify(road, null, 2)}</pre>
              </Tooltip>
            </Polyline>
          )
        ))}
      </MapContainer>

      <div>
        <h2>Buildings Data:</h2>
        {buildingsData.map((building, index) => (
          <pre key={index}>{JSON.stringify(building, null, 2)}</pre>
        ))}

        <h2>Roads Data:</h2>
        {roadsData.map((road, index) => (
          <pre key={index}>{JSON.stringify(road, null, 2)}</pre>
        ))}
      </div>
    </>
  );
};

export default Map;