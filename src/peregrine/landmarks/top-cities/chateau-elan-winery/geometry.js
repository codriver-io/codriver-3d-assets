import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './chateau-elan-winery-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const{rect,prism,loft,face,cap,cyl,flush}=t,ring=[[-20.681111673383633,-11.044037369693276],[-20.49919319259454,15.021686301972384],[-27.009780197645313,15.05986039229417],[-27.847328561171054,36.91843877756546],[-20.459931532550534,36.95938228429514],[-20.30969578224141,41.07510342388232],[9.685290214146988,41.03014265440706],[14.022694630207315,41.02759584625021],[14.082037021369162,27.54081657350971],[11.038241511205252,27.54142091455551],[11.525812942547532,15.512047046960134],[13.263772792317017,15.492620729970946],[13.992322361012159,0.607788058725719],[11.956105121159405,0.02837188814807612],[12.98286815925308,-11.211192576822715],[23.216338736284108,-11.120582601056489],[24.553020448795948,-52.60934653802389],[9.57589887938888,-53.26983390375702],[6.241047746347082,-53.419428171497856],[4.81562035675315,-47.66584555074458],[-11.317349819151946,-48.006509380767326],[-12.824575301572414,-10.844199086870702]];
 function clip(poly,axis,limit,less){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],A=less?a[axis]<=limit:a[axis]>=limit,C=less?c[axis]<=limit:c[axis]>=limit;if(A)out.push(a);if(A!==C){const f=(limit-a[axis])/(c[axis]-a[axis]);out.push(a.map((v,j)=>v+(c[j]-v)*f));}}return out;}const omitEdge=(a,c)=>Math.abs(a[1]+11)<.01&&Math.abs(c[1]+11)<.01;const main=clip(ring,1,-11,false),north=clip(ring,1,-11,true),rear=clip(north,0,14.2,true),hall=clip(north,0,14.2,false);prism(main,0,.8,'trim',{top:false,bottom:false,omitEdge});prism(main,.8,10.8,'stone',{floors:2,margin:.27,trim:'trim',roof:'roof',bottom:false,omitEdge});prism(rear,0,8,'annex',{floors:0,roof:'annex',bottom:false,omitEdge});prism(hall,0,5.5,'stone',{floors:1,margin:.2,bays:8,roof:'tile',bottom:false,omitEdge});t.wall([-20.7,-11],[-7,-11],8,10.8,'stone',{},-1);loft([rect(10.5,41.7,19.4,-32),rect(1,36,19.4,-32)],[5.5,7.7],'tile');
 // Three separate, tall square roof pavilions; rear southwest roof is not replaced by a flat wing.
 const towers=[[3,29],[3,-1],[-17,29]];
 for(const[x,z]of towers){prism(rect(20,20,x,z),0,11.8,'stone',{floors:2,bays:8,margin:.27,trim:'trim',top:false,bottom:false});for(const y of[.8,5.8,11.5])prism(rect(20.3,20.3,x,z),y,y+.22,'trim');loft([rect(21.4,21.4,x,z),rect(3,3,x,z)],[11.8,24.4],'roof',{caps:false});cap(rect(3,3,x,z),24.4,'roof');
 for(const side of[-1,1]){b.bar('trim',[x-1.7,25.2,z+side*1.7],[x+1.7,25.2,z+side*1.7],.12);b.bar('trim',[x+side*1.7,25.2,z-1.7],[x+side*1.7,25.2,z+1.7],.12);for(let i=0;i<=(near?5:2);i++){const q=-1.7+i*3.4/(near?5:2);b.bar('trim',[x+q,24.4,z+side*1.7],[x+q,25.2,z+side*1.7],.09);b.bar('trim',[x+side*1.7,24.4,z+q],[x+side*1.7,25.2,z+q],.09);}}
 cyl('metal',x,z,.075,24.4,29.5,.055,near?8:6);}
 // Dormered central connector, between the front pavilions.
 loft([rect(20,10,3,14),rect(4,10,3,14)],[11.8,17.4],'roof');
 for(const z of[10.5,14,17.5]){prism(rect(2,1.6,9,z),13.8,15.8,'trim',{floors:1,bays:1,margin:.2,roof:'roof'});const x=10.05;face('trim',[[x,15.8,z-.95],[x,15.8,z+.95],[x,16.7,z]],[1,0,0]);for(const side of[-1,1])face('roof',[[8,15.8,z+side*.95],[10.2,15.8,z+side*.95],[10.2,16.7,z],[8,16.7,z]],[0,1,side]);}
 // Open six-bay arcade in front of the recessed ground-level doors.
 const cols=[4,7.3,10.6,13.9,17.2,20.5,23.8],x0=12.5,x1=15.8,y0=.15,y1=5.9;
 cap(rect(x1-x0,20,14.15,14),.15,'trim');
 for(let j=0;j<cols.length-1;j++){const z=(cols[j]+cols[j+1])/2,w=2.6,holes=[[[z-w/2,y0],[z+w/2,y0],...Array.from({length:near?13:9},(_,i)=>{const a=i*Math.PI/(near?12:8);return[z+w/2*Math.cos(a),3.5+w/2*Math.sin(a)];})]],outer=[[cols[j],y0],[cols[j+1],y0],[cols[j+1],y1],[cols[j],y1]],all=[...outer,...holes[0]];
 for(const x of[x0,x1])for(const tri of THREE.ShapeUtils.triangulateShape(outer.map(p=>new THREE.Vector2(...p)),holes.map(h=>h.map(p=>new THREE.Vector2(...p)))))face('stone',tri.map(i=>[x,all[i][1],all[i][0]]),[x===x1?1:-1,0,0]);for(let i=0;i<holes[0].length;i++){const a=holes[0][i],c=holes[0][(i+1)%holes[0].length];face('trim',[[x0,a[1],a[0]],[x1,a[1],a[0]],[x1,c[1],c[0]],[x0,c[1],c[0]]],[0,a[0]-c[0],c[1]-a[1]]);}}
 b.box('trim',[14.15,6.15,14],[3.3,.5,20]);for(let z=4.2;z<24;z+=near?.8:1.6)b.bar('trim',[15.8,6.4,z],[15.8,7.3,z],.13);b.bar('trim',[15.8,7.3,4],[15.8,7.3,24],.16);
 // Winery production annex remains low, with a muted roof and a glazed side rhythm.
 // The exact mapped envelope below supplies its perimeter rather than a separate neighboring hotel.
 return flush(-0.13962634015954636);
}
