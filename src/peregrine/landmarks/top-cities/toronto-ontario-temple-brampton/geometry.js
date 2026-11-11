import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './toronto-ontario-temple-brampton-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
const raw=LOCAL_RINGS[0],theta=Math.atan2(raw[7][1]-raw[6][1],raw[7][0]-raw[6][0]),R=raw.map(([x,z])=>[x*Math.cos(theta)+z*Math.sin(theta),-x*Math.sin(theta)+z*Math.cos(theta)]);
function clip(r,k,b,g){let q=[];for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length],ia=g?a[k]>=b:a[k]<=b,ic=g?c[k]>=b:c[k]<=b;if(ia)q.push(a);if(ia!==ic){const t=(b-a[k])/(c[k]-a[k]);q.push(a.map((v,j)=>v+t*(c[j]-v)));}}return q;}
const F=Math.min(R[6][0],R[16][0]),body=clip(R,0,F,true),v0=(R[25][1]+R[26][1])/2,v1=(R[23][1]+R[24][1])/2,vc=(v0+v1)/2;
// Tiled round-headed blind panels; lower windows replace, rather than cover, the facade.
function pane(a,c,y0,y1,mat='white',blind=true,lowerWindows=true){const dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz),n=[dz,0,-dx],p=(s,y)=>[a[0]+dx*s/L,y,a[1]+dz*s/L],patch=(m,s,t,lo,hi)=>face(m,[p(s,lo),p(t,lo),p(t,hi),p(s,hi)],n);if(L<3){patch(mat,0,L,y0,y1);return;}const N=Math.max(1,Math.round(L/(near?5.6:7.8))),pitch=L/N;for(let j=0;j<N;j++){const mid=(j+.5)*pitch,w=Math.min(pitch*.76,(y1-y0-1.2)*1.1),r=w/2,base=y0+.35,head=y1-.8,cy=head-r,s=mid-r,t=mid+r;patch(mat,j*pitch,s,y0,y1);patch(mat,t,(j+1)*pitch,y0,y1);patch(mat,s,t,y0,base);const gh=Math.min(base+3,cy);if(blind&&lowerWindows){const gw=w*.64;patch('recess',s,mid-gw/2,base,gh);patch('recess',mid+gw/2,t,base,gh);patch('recess',s,t,gh,cy);patch('glass',mid-gw/2,mid+gw/2,base,gh);}else patch(blind?'recess':'glass',s,t,base,cy);
 const steps=near?10:6;for(let k=0;k<steps;k++){const x0=s+w*k/steps,x1=s+w*(k+1)/steps,Y=x=>cy+Math.sqrt(Math.max(0,r*r-(x-mid)**2)),z0=Y(x0),z1=Y(x1);face(blind?'recess':'glass',[p(x0,cy),p(x1,cy),p(x1,z1),p(x0,z0)],n);face(mat,[p(x0,z0),p(x1,z1),p(x1,y1),p(x0,y1)],n);}}
}
const sign=Math.sign(body.reduce((s,p,i)=>s+p[0]*body[(i+1)%body.length][1]-body[(i+1)%body.length][0]*p[1],0));if(sign<0)body.reverse();for(let i=0;i<body.length;i++)pane(body[i],body[(i+1)%body.length],0,11.8);cap('roof',body,11.8);cap('white',body,0,-1);
// Thin portico slab follows the mapped west wings and leaves the central grand arch free.
const portico=clip(R,0,F-.65,false);for(const side of [clip(portico,1,v0,false),clip(portico,1,v1,true)]){solid(side,4.8,5.25,'white');const zmin=Math.min(...side.map(p=>p[1])),zmax=Math.max(...side.map(p=>p[1])),n=Math.max(2,Math.round((zmax-zmin)/4.7));for(let i=0;i<n;i++){const v=zmin+.6+(zmax-zmin-1.2)*i/(n-1),u=R[0][0]+(R[22][0]-R[0][0])*(v-R[0][1])/(R[22][1]-R[0][1])+1.55;box('column',[u,2.4,v],[.55,4.8,.55]);}}
// Grand entry: an open arched tunnel with full soffit and jamb thickness.
const front=(R[24][0]+R[25][0])/2,back=F-.1,outer0=v0,outer1=v1,hole0=vc-3.55,hole1=vc+3.55,base=.12,cy=7.3,top=13.8,rr=3.55,steps=near?18:10;
for(const [u,out]of[[front,[-1,0,0]],[back,[1,0,0]]]){const P=(v,y)=>[u,y,v];face('white',[P(outer0,0),P(hole0,0),P(hole0,top),P(outer0,top)],out);face('white',[P(hole1,0),P(outer1,0),P(outer1,top),P(hole1,top)],out);for(let i=0;i<steps;i++){const a=hole0+(hole1-hole0)*i/steps,c=hole0+(hole1-hole0)*(i+1)/steps,Y=v=>cy+Math.sqrt(Math.max(0,rr*rr-(v-vc)**2));face('white',[P(a,Y(a)),P(c,Y(c)),P(c,top),P(a,top)],out);}}
for(const[v,n]of[[hole0,[0,0,1]],[hole1,[0,0,-1]],[outer0,[0,0,-1]],[outer1,[0,0,1]]])face('white',[[front,0,v],[back,0,v],[back,top,v],[front,top,v]],n);
for(let i=0;i<steps;i++){const a=Math.PI*i/steps,c=Math.PI*(i+1)/steps,P=(u,t)=>[u,cy+rr*Math.sin(t),vc+rr*Math.cos(t)];face('white',[P(front,a),P(back,a),P(back,c),P(front,c)],[0,-Math.sin((a+c)/2),-Math.cos((a+c)/2)]);}face('white',[[front,top,outer0],[front,top,outer1],[back,top,outer1],[back,top,outer0]],[0,1,0]);
// Tiers sit over the main body, with rounded blind panels matching the facade rhythm.
const u=F+6.3;for(const[w,d,lo,hi]of[[12,14.8,11.8,14.6],[10,12,14.6,18],[8,8,18,25.5],[4.4,4.4,25.5,37.4]]){const q=rect(u,vc,w,d);for(let i=0;i<4;i++)pane(q[i],q[(i+1)%4],lo,hi,'white',true,false);cap('white',q,hi);}
loft([{x:u,z:vc,y:37.4,r:2.1},{x:u,z:vc,y:49.7,r:.25}],'roof',8);
// Original simplified Moroni silhouette, no borrowed mesh or texture.
loft([{x:u,z:vc,y:49.7,r:.18},{x:u,z:vc,y:50,r:.28},{x:u,z:vc,y:51.3,r:.23},{x:u,z:vc,y:51.65,r:.15}],'gold',near?12:8);loft([{x:u,z:vc,y:51.65,r:.16},{x:u,z:vc,y:51.87,r:.21},{x:u,z:vc,y:52.08,r:.13},{x:u,z:vc,y:52.1208,r:.03}],'gold',near?12:8);
bar('gold',[u-.1,51.85,vc],[u-1.35,51.92,vc],.075,.075);bar('gold',[u-.1,51.35,vc-.1],[u-.67,51.72,vc-.1],.13,.13);bar('gold',[u-.67,51.72,vc-.1],[u-.72,51.88,vc],.12,.12);
for(let i=0;i<8;i++){const a=2*Math.PI*i/8,c=2*Math.PI*(i+1)/8,P=(x,r,t)=>[x,51.93+r*Math.cos(t),vc+r*Math.sin(t)];face('gold',[P(u-1.35,.04,a),P(u-1.57,.15,a),P(u-1.57,.15,c),P(u-1.35,.04,c)],[-.1,Math.cos((a+c)/2),Math.sin((a+c)/2)]);}
return finish(-theta);

}
