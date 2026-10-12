// Original surface authoring; no internal overlapping building-part faces.
import polygonClipping from "polygon-clipping";
import { MAPPED } from "./footprint.js";
import { SPEC } from "./config.js";
import { lngToMercX, latToMercY, mercStretch } from "../../../facade/geo.js";
export const PARTS = [{"id": 581342682, "height": 28.0, "bottom": 0.0}, {"id": 581342685, "height": 38.0, "bottom": 0.0}, {"id": 581342686, "height": 28.0, "bottom": 6.6}, {"id": 581354690, "height": 28.0, "bottom": 0.0}, {"id": 581354691, "height": 28.0, "bottom": 0.0}, {"id": 581354692, "height": 197.0, "bottom": 0.0}, {"id": 581354693, "height": 261.0, "bottom": 0.0}, {"id": 581354694, "height": 233.0, "bottom": 0.0}, {"id": 581354695, "height": 28.0, "bottom": 0.0}, {"id": 581354696, "height": 226.0, "bottom": 0.0}, {"id": 581354697, "height": 250.0, "bottom": 0.0}];
const k=mercStretch(SPEC.origin[1]), ox=lngToMercX(SPEC.origin[0]), oz=-latToMercY(SPEC.origin[1]);
export const localRing = id => MAPPED[id].map(([lng,lat])=>[(lngToMercX(lng)-ox)/k,(-latToMercY(lat)-oz)/k]);
export const unionAt = y => polygonClipping.union(...PARTS.filter(p=>p.bottom<=y && p.height>y).map(p=>[localRing(p.id)]));
export const difference = (a,b) => b.length?polygonClipping.difference(a,b):a;
export const LEVELS = [0,6.6,28,38,197,226,233,250,261];
