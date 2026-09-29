// Mapped outlines the Sharp Centre for Design model replaces, read 2026-09-29 through
// the shared Overpass queue (OpenStreetMap ways, both by OCAD University, 100 McCaul St):
//   way/27616814  "Sharp Centre for Design": the tabletop as mapped, 86.7 x 31.6 m
//                 (levels 5-6, tagged height=26 / min_height=19; the tag heights are the
//                 mapper's, the published figures are used for the model, see the doc).
//   way/225377144 "Main Building": the T-shaped 4-level block beneath (100 x 42 m along
//                 McCaul Street plus the 40 x 12 m stem toward Grange Park).
// The building:part ways 961216769-961216772 (brick block, the low gabled stem and the
// two 26 m black cores) all lie inside the Main Building ring, so they need no rings of
// their own; they are listed in OSM_WAYS because the model draws them.
// Rings are [lng, lat], closed implicitly. Mapped data (c) OpenStreetMap contributors, ODbL 1.0.
export const FOOTPRINTS = [
  [
    [-79.3915275, 43.6532873],
    [-79.391152, 43.6533697],
    [-79.39084, 43.6526247],
    [-79.3912153, 43.6525423],
  ],
  [
    [-79.3913565, 43.6537848],
    [-79.3909996, 43.6529154],
    [-79.3914997, 43.6528079],
    [-79.3916654, 43.6532117],
    [-79.3918332, 43.6531773],
    [-79.3918302, 43.6531686],
    [-79.3919623, 43.6531421],
    [-79.3919653, 43.6531506],
    [-79.3921421, 43.6531153],
    [-79.3921837, 43.6532223],
    [-79.3920897, 43.6532418],
    [-79.3920452, 43.6532509],
    [-79.3917097, 43.6533196],
    [-79.3918564, 43.6536775],
  ],
];
export const OSM_WAYS = ['way/27616814', 'way/225377144', 'way/961216769', 'way/961216770', 'way/961216771', 'way/961216772'];
