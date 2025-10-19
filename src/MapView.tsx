// src/MapView.jsx
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";

export default function MapView() {
  type Layers = {
    boundary: boolean;
    waterbody: boolean;
  };

  const [layers, setLayers] = useState<Layers>({
    boundary: true,
    waterbody: false,
  });

  const [boundary, setBoundary] = useState<any | null>(null);
  const [waterbody, setWaterbody] = useState<any | null>(null);

  useEffect(() => {
    fetch("/data/boundary.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch boundary");
        return res.json();
      })
      .then(setBoundary)
      .catch((err) => {
        console.error("Boundary fetch error:", err);
        setBoundary(null);
      });

    fetch("/data/waterbody.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch waterbody");
        return res.json();
      })
      .then(setWaterbody)
      .catch((err) => {
        console.error("Waterbody fetch error:", err);
        setWaterbody(null);
      });
  }, []);

  const toggleLayer = (name: keyof Layers) => {
    setLayers((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div style={{ display: "flex", width: "75vw", height: "75vh", borderRadius: "0.5rem" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "275px",
          padding: "1rem",
          background: "#000",
          borderRadius: "0.5rem 0 0 0.5rem",
          textAlign: "left",
          color: "#fff",
        }}
        role="region"
        aria-label="Map layer controls"
      >
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
        {...({
          center: [43.544811, -80.248108],
          zoom: 8,
          style: { height: "75vh", flex: 1, borderRadius: "0 0.5rem 0.5rem 0" },
          "aria-label": "Map showing Grand River and selected layers",
          role: "application",
          "aria-describedby": "layer-controls-heading",
        } as any)}
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
