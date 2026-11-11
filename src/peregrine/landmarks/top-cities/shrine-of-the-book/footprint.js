// Mapped dome ring plus an estimated wall envelope constrained by the mapped site edge.
// Pool decoration is separate from building replacement. Geographic data © OSM contributors.
export const FOOTPRINTS = [[[35.2028724, 31.7735338], [35.2029115, 31.7735396], [35.2029324, 31.773538], [35.2029695, 31.7735261], [35.2029958, 31.7735079], [35.203017, 31.7734794], [35.203025, 31.7734521], [35.203022, 31.7734185], [35.2030115, 31.7733958], [35.2029743, 31.7733615], [35.2029379, 31.7733482], [35.2029168, 31.7733456], [35.2028775, 31.7733499], [35.2028406, 31.7733665], [35.2028143, 31.7733916], [35.2027996, 31.773423], [35.2027973, 31.7734426], [35.2028042, 31.7734758], [35.2028152, 31.7734947], [35.202842, 31.7735196], [35.2028724, 31.7735338]], [[35.203155307060186, 31.773579326129646], [35.203171156342165, 31.773579454229164], [35.2031725626987, 31.77345369634787], [35.20315671341671, 31.773453568248353], [35.203155307060186, 31.773579326129646]]];
export const OSM_WAYS = [158934535];
export const CONTROL_POINTS = [[35.2031964, 31.7736204], [35.2032002, 31.7732806]];
import { SPEC } from './config.js';
const c=Math.cos(SPEC.rotationY),s=Math.sin(SPEC.rotationY),k=111320*Math.cos(SPEC.origin[1]*Math.PI/180);
export const LOCAL_RINGS=FOOTPRINTS.map(r=>r.slice(0,r.length-1).map(([lon,lat])=>{const x=(lon-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return [c*x-s*z,s*x+c*z];}));
