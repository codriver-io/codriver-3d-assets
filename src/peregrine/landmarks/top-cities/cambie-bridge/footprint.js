import {PROFILES} from './cambie-bridge-profile.js';
import {SB_WAYS,NB_WAYS} from './cambie-bridge-mapped.js';
// Tapered envelopes; branch interchange and heat utility remain provider-owned.
// Derived data © OpenStreetMap contributors, ODbL 1.0.
export const FOOTPRINTS=PROFILES.map(p=>p.ring());
export const OSM_WAYS=[...SB_WAYS,...NB_WAYS,497473842,113244337,972113595,113244334];
