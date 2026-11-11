import * as THREE from 'three';import {SPEC,PALETTES} from './config.js';import {kit} from './ohio-stadium-kit.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,quad,poly,cyl}=k;
 function beam(mat,a,b,w,d=w){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),v=bv.clone().sub(av),g=new THREE.BoxGeometry(w,v.length(),d);const ix=Array.from(g.index.array);g.setIndex(ix.filter((_,i)=>i<12||i>=24));g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());k.put(g,mat);}
 const contacts=[];
 const nl=near?10:6,na=near?44:28,end=79,cz=-10;
 function path(rx,rz){const p=[];for(let i=0;i<nl;i++)p.push([-rx,end+(cz-end)*i/nl]);for(let i=0;i<=na;i++){const a=Math.PI+i*Math.PI/na;p.push([rx*Math.cos(a),cz+rz*Math.sin(a)]);}for(let i=1;i<=nl;i++)p.push([rx,cz+(end-cz)*i/nl]);return p;}
 function strip(mat,ri,zi,yi,ro,zo,yo){const a=path(ri,zi),b=path(ro,zo);for(let i=0;i<a.length-1;i++)quad(mat,[a[i][0],yi,a[i][1]],[a[i+1][0],yi,a[i+1][1]],[b[i+1][0],yo,b[i+1][1]],[b[i][0],yo,b[i][1]],[0,1,0]);}
 // Open field has no invented letters, marks or emblems. Surface sits .16 m above grade.
 box('field',0,.08,3,53.34,.16,109.73);
 function tiers(ri,zi,ro,zo,y0,y1,n){for(let j=0;j<n;j++){const t=j/n,u=(j+1)/n,rx=ri+(ro-ri)*t,rz=zi+(zo-zi)*t,RX=ri+(ro-ri)*u,RZ=zi+(zo-zi)*u,y=y0+(y1-y0)*t,Y=y0+(y1-y0)*u;strip(j%9===5?'red':'seat',rx,rz,y,RX,RZ,y);strip('stone',RX,RZ,y,RX,RZ,Y);}}
 tiers(34,72,64,97,.6,16.2,near?28:12);
 strip('stone',64,97,16.2,69,102,16.2);
 tiers(69,102,100,123,18.5,34.0,near?24:10);
 // Front rims and the split bowl ends close the support volumes without covering the playing field.
 for(const side of [-1,1]){
  k.panel('stone',[[side*34,0],[side*101,0],[side*101,34.0],[side*69,18.5],[side*64,16.2],[side*34,.6]],.5,0,end,0);
 }
 // Historic lower concrete arcade: every gate is a real opening, not a pasted dark stripe.
 const rim=path(101,124);for(let i=0;i<rim.length-1;i++){
  const a=rim[i],b=rim[i+1],x=(a[0]+b[0])/2,z=(a[1]+b[1])/2;
  if(z<-125&&Math.abs(x)<36)continue; // north rotunda and towers own this central segment
  const dx=b[0]-a[0],dz=b[1]-a[1],w=Math.hypot(dx,dz),ang=Math.PI-Math.atan2(dz,dx);
  wall('stone',w+.04,0,20,.65,x,z,ang,[{u:0,y:1.4,w:w*.64,h:12.2,arch:true,mat:'roof'},{u:0,y:15.5,w:w*.68,h:2.65,mat:'glass'}]);
  // Upper deck is visibly carried by open steel uprights and rakers.
  const norm=[Math.sin(ang),Math.cos(ang)];
  beam('steel',[x,20,z],[x,34.0,z],near?.38:.5);contacts.push({label:'upper arcade upright',ends:[[x,20,z],[x,34.0,z]]});
  const inner=path(69,102);const u=inner[i],v=inner[i+1],a0=[(u[0]+v[0])/2,15.5,(u[1]+v[1])/2],b0=[x,31.0,z];beam('steel',a0,b0,near?.42:.5);contacts.push({label:'upper deck raker',ends:[a0,b0]});
 }
 strip('stone',99.4,122.4,34.0,101,124,34.0);
 // Closed soffits keep the open frame honest when viewed from the road below.
 function soffit(ri,zi,yi,ro,zo,yo){const a=path(ri,zi),b=path(ro,zo);for(let i=0;i<a.length-1;i++)quad('stone',[a[i][0],yi,a[i][1]],[b[i][0],yo,b[i][1]],[b[i+1][0],yo,b[i+1][1]],[a[i+1][0],yi,a[i+1][1]],[0,-1,0]);}
 soffit(34,72,0,64,97,13.2);soffit(69,102,15.5,101,124,31.0);soffit(64,97,14.8,69,102,15.5);
 function curtain(rx,rz,y0,y1,inward=false){const p=path(rx,rz);for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1],n=[b[1]-a[1],0,a[0]-b[0]];if(inward)for(let j=0;j<3;j++)n[j]*=-1;const top=rx===101&&(a[0]+b[0])/2< -100&&(a[1]+b[1])/2> -63&&(a[1]+b[1])/2<75?31.825:y1;quad('stone',[a[0],y0,a[1]],[b[0],y0,b[1]],[b[0],top,b[1]],[a[0],top,a[1]],n);}}
 curtain(34,72,0,.6,true);curtain(64,97,13.2,16.2);curtain(69,102,15.5,18.5,true);curtain(101,124,31.0,34.0);
 // Enclosed two-storey west press box: broad overhanging roof and separate glazed levels.
 const px=-94.5,pz=6,pw=13,pl=138,p0=32.0,p1=40.7;
 for(const y of [32.0,36.35,40.7])box('steel',px,y,pz,pw,.35,pl);
 for(const side of [-1,1]){
  const x=px+side*pw/2,a=side*Math.PI/2;
  wall('steel',pl,p0,p1,.5,x,pz,a,[{u:0,y:32.65,w:pl-2.0,h:3.05,mat:'glass'},{u:0,y:37.0,w:pl-2.0,h:3.05,mat:'glass'}]);
  for(let j=-7;j<=7;j++)box('steel',x+side*.35,36.3,pz+j*9,.3,8.1,.20);
 }
 for(const side of [-1,1])wall('steel',pw,p0,p1,.5,px,pz+side*pl/2,side>0?0:Math.PI,[{u:0,y:32.65,w:pw-1.8,h:3.05,mat:'glass'},{u:0,y:37,w:pw-1.8,h:3.05,mat:'glass'}]);
 box('roof',px+.5,41.0764,pz,19,.7528,142);
 // Named supports meet the enclosed floor and the concrete deck below.
 for(const z of [-57,-30,-3,24,51,69]){box('steel',-100.5,31.35,z,.7,1.3,.7);}
 // North rotunda is a real vaulted entrance, with flanking square towers.
 const rz=-138.5;
 wall('stone',23.0,0,25.908,.85,0,rz,Math.PI,[{u:0,y:.3,w:8.5,h:17,arch:true},{u:-8,y:.3,w:3.4,h:13.6,arch:true},{u:8,y:.3,w:3.4,h:13.6,arch:true}]);
 for(const side of [-1,1]){
  const x=side*27.2;
  wall('stone',17.5,0,25.3,.7,x,-138,Math.PI,[{u:0,y:1,w:6,h:13.5,arch:true,mat:'roof'},...[-4.9,0,4.9].map(u=>({u,y:19,w:2.1,h:4.3,arch:true,mat:'roof'}))]);
  box('stone',x,12.5,-131,17.5,25,13.3);box('stone',x,25.4,-131,19,.65,14.5);
 }
 // Pantheon-like shallow rotunda vault behind the open central arch.
 const dome=new THREE.SphereGeometry(10.668,near?28:16,near?10:6,0,Math.PI*2,0,Math.PI/2);dome.scale(1,.55,1);dome.translate(0,19,-127);k.put(dome,'stone');
 for(const side of [-1,1])box('stone',side*10.3,10,-128,.8,20,20.5);
 box('stone',0,22.0,-129,22.9,1.2,19);
 // Separate modern south stand leaves both diagonal corner gaps open to the road.
 const sw=132,z0=89,z1=130,n=near?32:14,profile=[[z0,0],[z0,3.4]];
 for(let j=0;j<n;j++){
  const z=z0+(z1-z0)*j/n,Z=z0+(z1-z0)*(j+1)/n,y=3.4+32*j/n,Y=3.4+32*(j+1)/n;
  quad(j%10===4?'red':'seat',[sw/2,y,z],[-sw/2,y,z],[-sw/2,y,Z],[sw/2,y,Z],[0,1,0]);
  quad('stone',[-sw/2,y,Z],[sw/2,y,Z],[sw/2,Y,Z],[-sw/2,Y,Z],[0,0,-1]);
  profile.push([Z,y],[Z,Y]);
 }
 profile.push([z1,31]);
 for(const side of [-1,1])k.panel('stone',profile.map(([z,y])=>[-side*z,y]),.25,side*sw/2,0,side*Math.PI/2);
 quad('stone',[-sw/2,0,z0],[sw/2,0,z0],[sw/2,3.4,z0],[-sw/2,3.4,z0],[0,0,-1]);
 quad('stone',[-sw/2,31,z1],[sw/2,31,z1],[sw/2,35.4,z1],[-sw/2,35.4,z1],[0,0,1]);
 quad('stone',[-sw/2,0,z0],[-sw/2,31,z1],[sw/2,31,z1],[sw/2,0,z0],[0,-1,0]);
 for(let i=-6;i<=6;i++){
  const x=i*10.5;box('stone',x,.35,131,1.1,.7,1.1);box('stone',x,.35,92,1.1,.7,1.1);beam('steel',[x,.7,131],[x,35.2,131],.5);beam('steel',[x,.7,92],[x,35.2,131],.55);
 }
 box('steel',0,35.5,131,133,.7,1.4);
 // Unlettered south scoreboard with four grounded uprights, no logos or video texture.
 for(const x of [-19,-7,7,19])box('steel',x,20.7264,135,.7,41.4528,.7);
 box('roof',0,34.8,135.1,40,12.5,1.4);box('steel',0,41.1,135.1,42,.7056,2.2);
 const root=k.finish();root.userData.structureContacts=contacts;root.userData.pressBox={width:13,length:138,floor:32,roofHeight:41.4528,roofWidth:19,roofLength:142,glazedLevels:2,bowlRim:34};return root;
}
