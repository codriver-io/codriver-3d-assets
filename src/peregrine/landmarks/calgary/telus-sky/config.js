// Telus Sky (Calgary House), 685 Centre Street SW, Calgary: Bjarke Ingels Group and Dialog for Westbank, 2019.
// Published: 222.3 m to the roof, 59 storeys mapped (OSM way 500294061 building:levels=59; Wikipedia counts 60), offices on floors 1 to 29,
// residences on 30 to 58. "The building was designed with a clean rectangular base and bottom floors for efficient open-office layouts,
// and as the building rises, the floor plates slowly reduce in size and pixilate creating small balconies and terraces" (Wikipedia).
// Douglas Coupland's LED artwork "Northern Lights" clads the northern and southern facades.
// Mapped (OSM): the outline's tower plate is a 51.4 x 34.3 m rectangle whose sides run 2.45 degrees off the cardinal axes (fitted from every
// edge of the outline; the downtown grid), with a 10-level podium strip on its west side and small overhanging volumes on the north and
// south-east. Everything else (storey heights, how far each face steps back, the pixel pattern) is estimated from photographs; see
// docs/3d-calgary-telus-sky.md.
export const SPEC = {
  id: 'telus-sky', name: 'Telus Sky', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Centre of the mapped 51.4 x 34.3 m tower plate (the origin of the plan frame below).
  origin: [-114.0635398, 51.0467718],
  height: 222.3, // m to the roof plant on the highest, east end of the stepped roof
  padM: 42, // Calgary downtown is flat; the pad just covers the footprint (the farthest mapped point is 36 m from the origin)
  frontageBearing: 182, // the south face looks onto 7 Avenue SW
  gridBearingDeg: 2.45, // clockwise rotation of the plan frame (u east, v south) from the cardinal axes; baked into the geometry
  plan: {
    width: 51.43, depth: 34.27, // m, tower plate east-west (u) and north-south (v), mapped
    bayCells: 6, rowCells: 5, // 6 cells (7.3 m) per pixel column on the north and south faces, 5 cells (6.9 m) per row on the east and west faces
  },
  // Level heights (m). Storey count 59 follows OSM; the split between office and residential floors follows Wikipedia (offices 1 to 29,
  // residences 30 to 58); the heights themselves are estimated so the roof lands on 222.3 m with the plant.
  levels: { lobby: 7.0, office: 4.1, officeCount: 28, residential: 3.3, residentialCount: 29, plant: 3.6, roofPlant: 1.2 },
};

// Silvery blue-grey frames and spandrels around light-blue glass (a pale mosaic by day, dark by night); pale concrete terraces where a floor steps back. `glow` is the
// Northern Lights LED (a dark slate fascia by day, aurora green at night); `light` is a share of lit apartment windows (it reads as
// glass by day). Both are drawn unshaded.
export const PALETTES = {
  light: {
    glass: '#5f84a8', frame: '#5b6773', ledge: '#8b9298', glow: '#505b68', light: '#4c6a86', metal: '#7b8288',
  },
  dark: {
    glass: '#22364a', frame: '#0f1318', ledge: '#363c43', glow: '#33e8a2', light: '#f2d395', metal: '#3b4248',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The street-level lobby floor is y=0; the +15 skywalk, the 31 m excavation and the underground levels are not modelled.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Height (222.3 m), plate size, grid rotation and the west podium follow OSM, Wikipedia and the street grid; the storey heights, how far the north, west and east faces step back and the pixel pattern are estimated from photographs. The Northern Lights LED is shown as green fascia strips on the north and south faces, not its real layout; the small overhanging volumes are mapped but their structure is a guess.',
};
