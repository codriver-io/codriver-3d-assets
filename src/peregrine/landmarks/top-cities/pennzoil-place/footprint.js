// OpenStreetMap extrusions Pennzoil Place replaces, read 2026-10-14 from the
// dossier extract (© OpenStreetMap contributors, ODbL 1.0).
// 580965929 is the whole complex (building=yes, 36 levels, glass, #52503C).
// 260511513 is the south tower, 711 Louisiana Street (height 121, skillion +30).
// 260511516 is the north tower, 700 Milam Street (height 121, skillion +30).
// 260511512 is the glazed atrium between them (gabled, the notches and the throat).
// Neighbours (Jones Hall, TC Energy Center, Bank of America Tower) stay provider-owned.
export const FOOTPRINTS = [
  // way/580965929 outline
  [[-95.3661718, 29.7600336], [-95.3659464, 29.7603125], [-95.3657222, 29.7605989], [-95.3650723, 29.7602093], [-95.3652819, 29.7599457], [-95.3655219, 29.7596440], [-95.3661718, 29.7600336]],
  // way/260511513 Louisiana / south tower
  [[-95.3655219, 29.7596440], [-95.3656246, 29.7601244], [-95.3659464, 29.7603125], [-95.3661718, 29.7600336], [-95.3655219, 29.7596440]],
  // way/260511516 Milam / north tower
  [[-95.3657222, 29.7605989], [-95.3656303, 29.7601513], [-95.3652819, 29.7599457], [-95.3650723, 29.7602093], [-95.3657222, 29.7605989]],
  // way/260511512 atrium
  [[-95.3659464, 29.7603125], [-95.3656246, 29.7601244], [-95.3655219, 29.7596440], [-95.3652819, 29.7599457], [-95.3650723, 29.7602093], [-95.3657222, 29.7605989], [-95.3659464, 29.7603125]],
];

export const OSM_WAYS = ['way/580965929', 'way/260511513', 'way/260511516', 'way/260511512'];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
