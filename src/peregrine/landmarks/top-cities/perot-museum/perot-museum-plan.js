// East/up/south frame. Control points on way 1188705976:
// southwest [-96.8069692,32.7868135], southeast [-96.8065626,32.786592].
export const ORIGIN = [-96.80665,32.78689];
export const ALONG = [0.83931,0.54364];
export const OUT = [-0.54364,0.83931];
export const CENTER = [2.12,0.84];
export const WIDTH = 45.3, DEPTH = 47.7, BASE = 8, HEIGHT = 51.816;
export const point = (u,y,v) => [CENTER[0]+ALONG[0]*u+OUT[0]*v,y,CENTER[1]+ALONG[1]*u+OUT[1]*v];
export const local = (x,z) => [(x-CENTER[0])*ALONG[0]+(z-CENTER[1])*ALONG[1],(x-CENTER[0])*OUT[0]+(z-CENTER[1])*OUT[1]];
export const TUBE_A = [-1,10.3,22.9], TUBE_B = [37.47,34.1,28.8];
