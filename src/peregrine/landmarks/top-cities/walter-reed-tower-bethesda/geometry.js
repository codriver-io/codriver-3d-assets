import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './walter-reed-tower-bethesda-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
const raw=LOCAL_RINGS[0],theta=Math.atan2(raw[14][1]-raw[13][1],raw[14][0]-raw[13][0])-Math.PI,R=raw.map(([x,z])=>[x*Math.cos(theta)+z*Math.sin(theta),-x*Math.sin(theta)+z*Math.cos(theta)]);
const x0=Math.min(R[25][0],R[29][0]),x1=Math.min(R[12][0],R[48][0]),z0=R[11][1],z1=R[48][1],cx=(x0+x1)/2,cz=(z0+z1)/2,w=x1-x0,d=z1-z0;
function clip(r,k,b,g){let q=[];for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length],ia=g?a[k]>=b:a[k]<=b,ic=g?c[k]>=b:c[k]<=b;if(ia)q.push(a);if(ia!==ic){const t=(b-a[k])/(c[k]-a[k]);q.push(a.map((v,j)=>v+t*(c[j]-v)));}}return q;}
// Disjoint mapped base regions meet the tower rather than overlapping its entrance facade.
for(const r of[clip(clip(R,1,z0,false),0,x1,false),clip(clip(R,1,z1,true),0,x1,false),clip(R,0,x1,true)]){solid(r,0,16.8,'stone','roof',{bottom:.8,top:16.5,dy:3.8,h:3.3,pitch:near?3.6:5.8,ratio:.36});solid(r,16.8,17.6,'stone','roof');}
// Main shaft has stacked glazing and lighter serpentine spandrels rather than large blue facade plates.
function shaft(r,lo,hi,bottom,pitch=3.4,entrance=false,crown=false){const area=Math.sign(r.reduce((s,p,i)=>s+p[0]*r[(i+1)%r.length][1]-r[(i+1)%r.length][0]*p[1],0));for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length],L=Math.hypot(c[0]-a[0],c[1]-a[1]),n=[area*(c[1]-a[1]),0,area*(a[0]-c[0])],P=(s,y)=>[a[0]+(c[0]-a[0])*s/L,y,a[1]+(c[1]-a[1])*s/L],patch=(mat,s,t,y,z)=>{if(z>y&&t>s)face(mat,[P(s,y),P(t,y),P(t,z),P(s,z)],n)},N=crown&&n[0]<-1?1:Math.max(1,Math.round(L/pitch)),p=L/N;if(entrance&&n[0]<-1){const mid=L/2;patch('stone',0,mid-1,lo,bottom);patch('stone',mid+1,L,lo,bottom);patch('stone',mid-1,mid+1,lo,1.1);patch('glass',mid-1,mid+1,1.1,5.5);patch('stone',mid-1,mid+1,5.5,bottom);}else patch('stone',0,L,lo,bottom);for(let j=0;j<N;j++){const mid=(j+.5)*p,a=mid-p*(crown&&n[0]<-1?.06:.17),c=mid+p*(crown&&n[0]<-1?.06:.17);patch('stone',j*p,a,bottom,hi);patch('stone',c,(j+1)*p,bottom,hi);const top=hi-2,rows=Math.max(1,Math.round((top-bottom)/3.5)),dy=(top-bottom)/rows;for(let k=0;k<rows;k++){const y=bottom+k*dy;patch('glass',a,c,y,y+dy*.74);patch('spandrel',a,c,y+dy*.74,y+dy);}patch('stone',a,c,top,hi);}}cap('roof',r,hi);cap('stone',r,lo,-1);}
shaft(rect(cx,cz,w,d),0,66,17.6);
// The narrower front stem follows the actual mapped western projection and leaves the forecourts open.
const fx0=R[26][0],fx1=x0,fz0=R[26][1],fz1=R[29][1],front=rect((fx0+fx1)/2,(fz0+fz1)/2,fx1-fx0,fz1-fz0);shaft(front,0,62.5,10,4.0,true);
// Crown tiers rise behind the projecting front shoulder, retaining narrow high window slots in far.
shaft(rect(cx+.6,cz,w-1.2,d-1.2),66,80.4672,68.2,3.3,false,true);
// Small roof plant caps on the original pavilions are confined to their mapped broad corner roofs.
for(const ids of[[13,14,23,24],[30,31,40,47]]){const ps=ids.map(i=>R[i]),x=(Math.min(...ps.map(p=>p[0]))+Math.max(...ps.map(p=>p[0])))/2,z=(Math.min(...ps.map(p=>p[1]))+Math.max(...ps.map(p=>p[1])))/2;solid(rect(x,z,7.5,5.5),17.6,20.3,'stone','roof');}return finish(-theta);

}
