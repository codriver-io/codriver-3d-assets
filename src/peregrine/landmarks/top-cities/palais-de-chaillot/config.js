import { TERRAIN_PAD } from './palais-de-chaillot-terrain.js';
export const SPEC = {
  id: "palais-de-chaillot", name: "Palais de Chaillot (Trocadéro)", kind: "building",
  ready: true, origin: [2.28807, 48.86234], height: 42, padM: 300,
  frontageBearing: 135, terrainPad:TERRAIN_PAD,
};
export const PALETTES = {
  light: { stone: "#e2ded1", roof: "#a4a69e", glass: "#455255", gold: "#d6b65b", spray: "#d8e7e5", water: "#719b98", garden: "#718365" },
  dark: { stone: "#686e75", roof: "#404c57", glass: "#444e53", gold: "#b39655", spray: "#7a999f", water: "#344f5a", garden: "#3c5148" },
};
export const MANIFEST = {
  elevationDatum: "Cityscape retains the lower fountain y=0 / parvis y=12 flat authoring frame. Full 3D world samples the Place/parvis median (about 65.2 m AWS Terrarium z15); rigid palace and statues shift -12 m relative to that runtime datum. Site-only reversible offsets follow a measured 33 m garden descent. Bounded node pads keep the theatre wall, stairs, garden levels and stepped basin clear; foundation feet extend beneath that TIN. No absolute scene altitude or Mercator stretch is baked into GLBs.",
  attribution: "Original procedural model for Codriver. Footprints © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
  note: "1937 twin curved wings, open parvis and five-storey palace, OSM 30 m height above the parvis. Curvature mapped; bays, figures and fountain plan are photo estimates. Review repair adds blank inscription ends, pale limestone, warm gold, broad spray cones and separately stepped world gardens/basin. The public DEM is not a basin survey; world water steps and lateral garden levels are approximations. Both-mode daytime still evidence and terrain regression tests are documented; lifecycle/DEM arrival, animated flicker and driving remain not tested.",
};
