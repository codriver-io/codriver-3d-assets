// Brookfield Place (Brookfield Place East), 225 6 Avenue SW, Calgary: Arney Fender Katsalidis with Dialog as delivery
// architect, completed 2017. 56 storeys, 247 m to the top of the glass crown (Wikipedia, OSM way 252560101: height=247,
// building:levels=56, building:material=glass). The mapped outline is a 66 x 41 m rectangle with rounded corners, turned
// about 2 degrees clockwise from the east-west avenue grid; the three-storey glass pavilion beside it is OSM way 575090048.
// Everything else (floor pitch, mullion rhythm, crown ribs, pavilion roof) is estimated from photographs; see
// docs/3d-calgary-brookfield-place-calgary.md.
export const SPEC = {
  id: 'brookfield-place-calgary', name: 'Brookfield Place', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Centre of the tower outline's best-fit rounded rectangle (OSM way 252560101).
  origin: [-114.0660248, 51.0471806],
  height: 247, // m to the top of the crown rim
  padM: 78, // covers the tower and the pavilion's far corner (75.5 m from the origin)
  // Outward bearing of the 6 Avenue SW frontage (the north face; 7 Avenue SW and the CTrain plaza are south).
  frontageBearing: 0,
  // The tower plan, in a frame (u east, v south) turned `rotationDeg` clockwise onto the mapped outline: the outline's long
  // edges run at bearing 91.3 to 92.5 and its short edges at 182.1 to 182.4, so the mean turn is about 2 degrees. The corner radius (5.5 m) is the
  // one that best hugs the outline's chamfered corners.
  plan: { halfU: 32.9, halfV: 20.5, radius: 5.5, rotationDeg: 2.0 },
  lobbyY: 12.9, // top of the two-storey lobby's belt cornice; the first floor line
  roofY: 229, // top of the curtain wall; the glass crown stands on a ledge here
  crownBaseY: 229.9, // top of that ledge
  floors: 52, // floor lines between lobbyY and roofY (4.16 m pitch)
  // The three-storey glass pavilion (OSM way 575090048): eave and ridge heights of its sloping glass roof (estimated).
  pavilion: { eaveY: 11.5, slope: 0.2, westX: -58.3 },
};

// Dark blue-grey reflective glass with a pale silver frame. `glow` is the lit offices and `light` the glass crown,
// both drawn unshaded: by day they must read as glass, so their light colours sit near the shaded glass.
export const PALETTES = {
  light: {
    glass: '#3f6a98', frame: '#aeb8c0', mullion: '#6e8092', glow: '#456f9a', light: '#8aa9c2', lobby: '#2f4256', roof: '#6c7174', pglass: '#6f969f',
  },
  dark: {
    glass: '#1a2837', frame: '#566370', mullion: '#36424e', glow: '#ebca8c', light: '#cfe1fa', lobby: '#161f29', roof: '#33383c', pglass: '#2c464e',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The lobby floor and the pavilion floor are y=0; the 7 Avenue plaza, the Plus 15 bridges and the below-grade levels are not modelled.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Height (247 m), storey count (56), plan size (66 x 41 m, corner radius 5.5 m) and orientation follow OSM and Wikipedia. The 4.16 m floor pitch, 1.5 m mullion rhythm, the 12.9 m two-storey lobby, the 18 m glass crown with its 2 m ribs, the roof plant and the pavilion roof pitch and height are estimated from photographs. The tower is modelled without the crown corner slits; lit offices are a deterministic pattern, not the real one.',
};
