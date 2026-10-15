import { FOOTPRINTS } from "./footprint.js";
export const SPEC = {
 id:"chateau-de-versailles",name:"Château de Versailles",kind:"building",ready: true,
 origin:[2.1203,48.8047],height:44,padM:250,frontageBearing:112,
 terrainPad:{rings:FOOTPRINTS,refs:[[2.1203,48.8047],[2.1217,48.8044],[2.1222,48.8051]],datum:"median",featherM:18},
};
export const PALETTES={
 light:{stone:"#bfb49e",trim:"#d1c5aa",brick:"#997b69",roof:"#465360",lead:"#929999",glass:"#3d4a4c",gold:"#b79b52",glow:"#536063",marble:"#9c9a91"},
 dark:{stone:"#64645f",trim:"#817c6d",brick:"#554b46",roof:"#293844",lead:"#555f64",glass:"#27353d",gold:"#ac9254",glow:"#ad935e",marble:"#545c60"},
};
export const MANIFEST={
 elevationDatum:"Rigid palace foundation at local grade y=0; no DEM altitude or latitude stretch baked into the GLB.",
 attribution:"Original procedural geometry. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright",
 note:"Present palace including North and South wings, Louis XIII marble court, Royal Chapel with mapped semicircular apse and Royal Gate; includes the two mapped garden basin rims; excludes the detached Ministers wings, remaining gardens and interiors. Chapel nave runs east-west in palace coordinates, with 43.65 m slate ridge and grounded gold crest to 44 m; classical roofs use pale lead grey. Heights except the 44 m chapel, roof profiles, bays, trophies and gilding are photograph estimates. Cityscape and Full 3D world visual placement checked with the scratch app bundle; terrain arrival, mode transitions and lifecycle certification remain separate.",
};
