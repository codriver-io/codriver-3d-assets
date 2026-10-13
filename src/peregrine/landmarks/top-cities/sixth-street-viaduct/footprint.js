// Road replacement is owned by PROFILE, not by building-extrusion rings.
// The mapped 1068873832 man_made=bridge outline is reference only; it is not a building.
// © OpenStreetMap contributors, ODbL 1.0, https://www.openstreetmap.org/copyright
import {ACCESS} from './sixth-street-viaduct-access.js';
export const FOOTPRINTS=[];
export const OSM_WAYS=[700357472,1106895614,700357386,700357387,398814236,1068873832,...ACCESS.flatMap(r=>r.ways)];
