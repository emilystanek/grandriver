import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";

export default function MapView() {
  type Layers = {
    boundary: boolean;
    waterbody: boolean;
  };

  const [boundary, setBoundary] = useState<any>(null);
  const [waterbody, setWaterbody] = useState<any>(null);

  const [layers, setLayers] = useState<Layers>({
    boundary: true,
    waterbody: true,
  });

  useEffect(() => {
    if (waterbody && boundary) return; // Already loaded
    let mounted = true;
    fetch("./data/boundary.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch boundary");
        return res.json();
      })
      .then(setBoundary)
      .catch((err) => {
        console.error("Boundary fetch error:", err);
        setBoundary(null);
      });

    fetch("./data/waterbody.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch waterbody");
        return res.json();
      })
      .then(setWaterbody)
      .catch((err) => {
        console.error("Waterbody fetch error:", err);
        setWaterbody(null);
      });
    return () => {
      mounted = false;
    };
  }, [waterbody, boundary]);

  const toggleLayer = (name: keyof Layers) => {
    setLayers((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div id="map-container">
      <div id="sidebar" role="region" aria-label="Map layer controls">
        <h1 id="layer-controls-heading">Grand River Layers</h1>

        <ul className="checkbox-list">
          <li>
            <label className="custom-checkbox" htmlFor="layer-boundary">
              <input
                id="layer-boundary"
                type="checkbox"
                checked={layers.boundary}
                onChange={() => toggleLayer("boundary")}
                aria-label="Toggle boundary layer"
                aria-checked={layers.boundary}
              />
              Boundary
            </label>
          </li>
          <br />
          <li>
            <label className="custom-checkbox" htmlFor="layer-waterbody">
              <input
                id="layer-waterbody"
                type="checkbox"
                checked={layers.waterbody}
                onChange={() => toggleLayer("waterbody")}
                aria-label="Toggle waterbody layer"
                aria-checked={layers.waterbody}
              />
              Waterbody
            </label>
          </li>
        </ul>
      </div>

      <MapContainer
        aria-describedby="layer-controls-heading"
        aria-label="Map showing Grand River and selected layers"
        center={[43.544811, -80.248108]}
        zoom={8}
        style={{ height: "75vh", flex: 1, borderRadius: "0 0.5rem 0.5rem 0" }}
      >
        <TileLayer
          {...({
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          } as any)}
        />

        {layers.boundary && boundary && (
          <GeoJSON
            data={boundary}
            pathOptions={{ color: "orange", weight: 0.5, fillOpacity: 0.2 }}
          />
        )}

        {layers.waterbody && waterbody && (
          <GeoJSON
            data={waterbody}
            pathOptions={{ color: "blue", weight: 1, fillOpacity: 0.5 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
