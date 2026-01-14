const getBoundaryGeoJSON = async () => {
  const response = await fetch(
    "https://cdn.jsdelivr.net/gh/emilystanek/geo-data@b1636b6/data/boundary.geojson"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch boundary");
  }
  return response.json();
}

const getWaterbodyGeoJSON = async () => {
  const response = await fetch(
    "https://cdn.jsdelivr.net/gh/emilystanek/geo-data@6654995/data/waterbody.geojson"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch waterbody");
  }
  return response.json();
}

export { getBoundaryGeoJSON, getWaterbodyGeoJSON };