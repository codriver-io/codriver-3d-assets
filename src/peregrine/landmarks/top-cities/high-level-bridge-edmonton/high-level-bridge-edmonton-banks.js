import { BufferGeometry, Float32BufferAttribute } from 'three';
import { PROFILE as p, FORK, WIDTH, RAIL_RISE } from './high-level-bridge-edmonton-profile.js';
const local=ll=>{const q=p.bridgeLocal(...ll);return [q.x,q.z];};
function inside(x,z,ring){let yes=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
let obstacles;
const blocked=(x,z)=>{
 obstacles??=BUILDINGS.map(r=>r.map(local));
 return [[p,WIDTH/2+1],[FORK,3.5]].some(([road,width])=>{const q=road.projectBridge(x,z);return !q.beyond&&Math.abs(q.lateral)<width;})||obstacles.some(r=>inside(x,z,r));
};
// Stop the batter at a road/building boundary; these short sides are retained.
export function bankToe(x,z,nx,nz,side,height,groundAt=()=>0){
 let width=4,ground=groundAt(x+nx*side*4,z+nz*side*4);
 const desired=4+Math.max(0,height-ground)*1.5;
 for(let w=4.25;w<=desired+.001;w+=.25){const px=x+nx*side*w,pz=z+nz*side*w;if(blocked(px,pz))break;width=w;ground=groundAt(px,pz);if(w>=4+Math.max(0,height-ground)*1.5)break;}
 return [x+nx*side*width,ground,z+nz*side*width];
}
export function bankGeometry(end,direction,lateral){
 const route=ROUTES[direction<0?0:1].map(local),start=p.bridgePoint(end,lateral),top=p.deckHeight(end)+RAIL_RISE-.35;
 let best={distance:Infinity};
 for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((start.x-a[0])*dx+(start.z-a[1])*dz)/(dx*dx+dz*dz))),x=a[0]+dx*t,z=a[1]+dz*t,distance=Math.hypot(start.x-x,start.z-z);if(distance<best.distance)best={distance,i,t,x,z};}
 const path=[[start.x,start.z],...route.slice(best.i)];
 const distances=[0];for(let i=1;i<path.length;i++)distances.push(distances[i-1]+Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]));
 const run=Math.min(distances.at(-1),Math.max(60,top*4)),count=Math.ceil(run/4),pos=[],weights=[],rows=[],idx=[];
 for(let i=0;i<=count+1;i++){
  const along=i===0?-8:run*(i-1)/count;let j=1;while(j<distances.length-1&&distances[j]<along)j++;
  const a=path[j-1],b=path[j],len=distances[j]-distances[j-1],t=(along-distances[j-1])/len,tx=(b[0]-a[0])/len,tz=(b[1]-a[1])/len,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t,nx=-tz,nz=tx,h=top*(1-Math.max(0,along)/run),s=p.projectBridge(x,z).s;
  rows.push({first:i*4,nx,nz});
  const section=[bankToe(x,z,nx,nz,-1,h),[x-nx*4,h,z-nz*4],[x+nx*4,h,z+nz*4],bankToe(x,z,nx,nz,1,h)];
  for(let k=0;k<4;k++){pos.push(...section[k]);weights.push(k===0||k===3?0:h/Math.max(.01,p.deckHeight(s)+RAIL_RISE-.35));}
  if(i)for(let k=0;k<3;k++){const a=(i-1)*4+k,b=i*4+k;idx.push(a,a+1,b,a+1,b+1,b);}
 }
 idx.push(0,2,1,0,3,2);
 const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(pos,3));geometry.setIndex(idx);geometry.computeVertexNormals();
 return {geometry,weights,rows};
}
// Refit only the earth toes: a world bank needs the actual height above its
// adjacent DEM, rather than the much larger stylized Cityscape height.
export function fitBankSlopes(model,ground){
 model.traverse(mesh=>{const rows=mesh.userData.bankRows;if(!mesh.isMesh||!rows)return;
  const g=mesh.geometry,pos=g.attributes.position;
  const at=(x,z)=>{const y=ground?.vertexGroundAt(x,z);return y==null?0:y/p.STRETCH;};
  for(const {first:i,nx,nz}of rows){const x=(pos.getX(i+1)+pos.getX(i+2))/2,z=(pos.getZ(i+1)+pos.getZ(i+2))/2,h=(pos.getY(i+1)+pos.getY(i+2))/2;
   for(const [k,side]of [[0,-1],[3,1]])pos.setXYZ(i+k,...bankToe(x,z,nx,nz,side,h,at));
  }
  pos.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
  const normals=g.attributes.normal,colors=g.attributes.color;if(colors){for(let i=0;i<normals.count;i++){const shade=.62+.38*Math.max(0,-.35*normals.getX(i)+.83*normals.getY(i)+.44*normals.getZ(i));colors.setXYZ(i,shade,shade,shade);}colors.needsUpdate=true;}
 });
}
// OSM dossier 463555601 plus adjoining ways 219620022, 113767071,
// 1474789002 and 461598599; OSM API map extracts saved with g1b3 evidence.
const ROUTES=[[[-113.5097513,53.5323972],[-113.5095719,53.532768],[-113.5094598,53.5330298],[-113.5093693,53.5332964],[-113.5092945,53.5335362],[-113.5092439,53.533773],[-113.5092091,53.5339757]],[[-113.513215,53.526324],[-113.5132437,53.5261969],[-113.51328,53.5260291],[-113.5132888,53.525908],[-113.5132955,53.5258021],[-113.5132718,53.5256955],[-113.5132569,53.5256518],[-113.5132379,53.5255927],[-113.5132122,53.5255187],[-113.5131957,53.525454],[-113.5131792,53.5253893],[-113.5131633,53.5252799],[-113.5131503,53.5252254],[-113.5131052,53.5251135]]];
const BUILDINGS=[];
