// Local metres in the mapped frame. Foot, 70 m and shaft controls come from
// OSM 1218304159/63/64 and 1021675582; bracing subdivisions are estimates.
export function layout(detail='near') {
 const axis=[-24.65,9.55],feet=[[2.25,-40.42],[37.3,6.2]],knots=[1.6,35,70,105,137];
 const at70=[[-13.77,-14.54],[1.28,9.21]],mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
 const node=(i,y)=>{if(i===0)return [axis[0],y,axis[1]];const f=feet[i-1],k=at70[i-1],p=y<=70?mix(f,k,(y-1.6)/(70-1.6)):mix(k,axis,(y-70)/67);return [p[0],y,p[1]];};
 const radius=y=>y<=70?4.8+(3.4-4.8)*y/70:3.4+(2.2-3.4)*(y-70)/67;
 const end=(i,y,toward)=>{const p=node(i,y),d=toward.map((v,j)=>v-p[j]);if(i===0){const n=Math.hypot(d[0],d[2]),r=radius(y)-.2;return [p[0]+d[0]/n*r,y,p[2]+d[2]/n*r];}const n=Math.hypot(...d);return p.map((v,j)=>v+d[j]/n*.55);};
 const legs=[],joints=[],braces=[];
 for(let i=1;i<=2;i++)for(let k=0;k<knots.length;k++){
  const y=knots[k],p=node(i,y);joints.push(p);
  if(k)legs.push({a:node(i,knots[k-1]),b:p,start:k===1?'roof':'white',end:k===knots.length-1?'lamp':'white'});
 }
 const connect=(i,y,j,h)=>{const a=node(i,y),b=node(j,h);if(Math.hypot(...a.map((v,k)=>v-b[k]))<2)return;braces.push({a:end(i,y,b),b:end(j,h,a)});};
 for(const y of [35,70,105])for(let i=0;i<3;i++)connect(i,y,(i+1)%3,y);
 const ys=[1.6,35,70,105];
 for(let k=0;k<ys.length-1;k++)for(let i=0;i<3;i++){
  const j=(i+1)%3;connect(i,ys[k],j,ys[k+1]);
  if(detail==='near')connect(j,ys[k],i,ys[k+1]);
 }
 return {axis,feet,legs,joints,braces};
}
