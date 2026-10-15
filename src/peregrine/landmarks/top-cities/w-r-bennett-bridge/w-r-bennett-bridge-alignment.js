// Mapped Highway 97 carriageways over and beside the bridge, OpenStreetMap contributors (ODbL 1.0).
// Bridge ways 100604760 (westbound, 3 lanes) / 5011652 (eastbound, 2 lanes) are straight two-node
// lines; approaches are Okanagan Highway 100604753 / 228898636 (west) and Harvey Avenue
// 615173507 / 397569498 (east). Saved extract: tmp/top-cities/w-r-bennett-bridge/map-{west,east}.json.
export const WESTBOUND = [[-119.5021091, 49.8813888], [-119.5022705, 49.8813098], [-119.5024247, 49.8812445], [-119.502579, 49.8811929], [-119.5027727, 49.8811394], [-119.5030686, 49.8810727], [-119.5044743, 49.8808173], [-119.5187311, 49.8782162], [-119.5197985, 49.8780416], [-119.5207381, 49.8779053], [-119.5210511, 49.87789]];
export const EASTBOUND = [[-119.5213125, 49.8777848], [-119.5208864, 49.8777786], [-119.5206646, 49.8777919], [-119.5205147, 49.8778148], [-119.5186904, 49.8781236], [-119.5044342, 49.880726], [-119.5030362, 49.8809985], [-119.5026985, 49.8810717], [-119.5025178, 49.8811188], [-119.5023444, 49.881177]];
// Shared path 478984978 on the south side; it continues west as 102419121 and leaves east into the
// City Park underpass (907539401 / 865192919).
export const PATH = [[-119.5186679, 49.8780723], [-119.5044094, 49.8806694]];
// Straight centreline: the mapped outline 881372979's midline (4.5 m north of the eastbound way),
// continued 75 m west (stopping short of the Campbell Road off-ramp gore) and 90 m east along the
// straight part of Harvey Avenue, so the flat-map ramps land on the connected roads.
export const CENTERLINE = [[-119.51971344, 49.87797886], [-119.50324416, 49.88098524]];
export const ROAD_WAYS = [100604760, 5011652, 100604753, 228898636, 615173507, 397569498];
// Service road 1055539170 (highway=service, asphalt): a real ground road along the south of the
// causeway from motorway_link 228898652 to a dead end beside the west abutment. It is NOT the
// shared path (path 102419121 lies under the authored walkway, and provider paths are never drawn
// at the near ring's detail zoom 16). Its last three segments turn back toward the deck and stop
// 5 m short of it under the first span, a stub that reads as a disconnected path; the layer masks
// just that hook so the road ends at grade, running parallel, beside the abutment. Its last five nodes
// (stations 67.5, 81.2, 85.0, 86.2, 86.7 m; 28.6, 27.4, 24.7, 22.1, 17.9 m south of the centreline):
export const SERVICE_ROAD_END = [[-119.5186998, 49.8778973], [-119.5185203, 49.8779408], [-119.5184795, 49.8779732], [-119.5184725, 49.8779987], [-119.5184819, 49.8780363]];
