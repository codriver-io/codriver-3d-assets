// Wembley Stadium, Foster + Partners / HOK Sport (now Populous), 2007.
export const SPEC = {
  id: 'wembley-stadium', name: 'Wembley Stadium', kind: 'building', ready: true,
  origin: [-0.2796038, 51.55606635], height: 133, padM: 175,
  frontageBearing: 3, ownTolM: 1,
};
export const PALETTES = {
  light: { wall:'#a9adae', glass:'#70868f', steel:'#c5ccca', glow:'#f4f5f3', roof:'#989fa4', dark:'#3d4649', seat:'#a44749', turf:'#4b724b', paint:'#e0e4da' },
  dark: { wall:'#56616a', glass:'#294957', steel:'#8498a4', glow:'#d6e5ed', roof:'#65757e', dark:'#26353f', seat:'#60363f', turf:'#304e42', paint:'#879d9d' },
};
export const MANIFEST = {
 elevationDatum: 'Local flat grade y=0, rigid bowl and arch foundations; no terrain or altitude baked in.',
 attribution: 'Original procedural model © Codriver 2026, CC BY 4.0; source MIT. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note: '2007 Wembley: 133 m crown, 315 m arch span, 7.4 m lattice diameter, 52 m roof. Near keeps the six-chord tubular lattice; far uses four 1.5 m diameter white chords and coarse hoops/diagonals for distant legibility. Hangers, roof opening and facade bays are photo-based simplifications. Arch feet slightly outside stadium provider ring; no unrelated provider buildings owned. App appearance is checked separately from export and lifecycle certification.',
};
