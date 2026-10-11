// Original low aggregate city quarters; intentionally not individual houses.
// Quarter axes follow the mapped interior street/building directions approximately.
export const ROOF_BLOCKS = [["north", 35, -155, 60, 48, 0.1], ["upper", 20, -100, 75, 42, 0.14], ["east", 50, -40, 60, 50, 0.1], ["centre", -40, -12, 95, 48, 0.06], ["west", -92, 60, 68, 48, 0.12], ["south", -20, 54, 85, 64, 0.04], ["southeast", 33, 103, 44, 34, -0.13], ["southwest", -150, 145, 32, 30, -0.1], ["south-centre", -32, 102, 44, 26, 0.08]];
export function blockRing([name,x,z,w,d,a]) {
 const t=[Math.cos(a),Math.sin(a)],n=[-t[1],t[0]];
 return [[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].map(([u,v])=>[x+u*t[0]+v*n[0],z+u*t[1]+v*n[1]]);
}
export function roofStrips(block) {
 const [name,x,z,w,d,a]=block,t=[Math.cos(a),Math.sin(a)],n=[-t[1],t[0]];
 const count=3,depth=d/count;
 return Array.from({length:count},(_,i)=>{
  const v=-d/2+(i+.5)*depth;
  const width=w*[.84,.96,.73][i],u=w*[-.06,.015,-.075][i];
  return {ring:blockRing([name,x+n[0]*v+t[0]*u,z+n[1]*v+t[1]*u,width,depth-.35,a]),eave:6.1+(i%3)*.9,rise:3.1+(i%2)*.6};
 });
}
export const ROOF_FOOTPRINTS=ROOF_BLOCKS.flatMap(roofStrips).map(b=>b.ring.map(([x,z])=>[2.36405+x/(111319.490793*Math.cos(43.20633*Math.PI/180)),43.20633-z/111319.490793]));

// The review enlarges the gateway archetypes beyond the cadastral outline; explicit owned
// envelopes include their 5% collar/eave projection rather than extending provider masks by tolerance.
export const GATE_FOOTPRINTS = [[119.036,-70.376],[111.964,-50.824]].map(([x,z])=>Array.from({length:20},(_,i)=>{const a=i*Math.PI/10;return [2.36405+(x+9.03*Math.cos(a))/(111319.490793*Math.cos(43.20633*Math.PI/180)),43.20633-(z+9.03*Math.sin(a))/111319.490793];}));
