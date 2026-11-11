import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './comerica-bank-tower-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const {rect,prism,face,wall,cap,flush}=t;
 function mass(w,d,y0,y1,floors,cx=0,cz=0){const ring=rect(w,d,cx,cz);ring.forEach((a,i)=>{const c=ring[(i+1)%4],len=Math.hypot(c[0]-a[0],c[1]-a[1]),central=i%2===0?Math.min(39,w):Math.min(22,d),start=(len-central)/2;const at=s=>[a[0]+(c[0]-a[0])*s/len,a[1]+(c[1]-a[1])*s/len];for(const [lo,hi,glass]of [[0,start,false],[start,start+central,true],[start+central,len,false]])if(hi-lo>.01)wall(at(lo),at(hi),y0,y1,glass?'metal':'stone',{floors,bays:Math.max(1,Math.round((hi-lo)/3.2)),margin:glass?.035:.22},1);});cap(ring,y1,'stone');cap(ring,y0,'stone',false);}
 // A full lower shaft, then crossed upper arms. Vertical glass waterfalls align with the vaults.
 mass(87.8,62.3,0,185,47);
 mass(43.8,62.3,185,217.88,8);
 mass(87.8,23.8,185,218,8);
 function vault(r,length,y0,alongX=false){
 const n=near?24:12,inner=r-1.6;
 const xyz=(x,y,z)=>alongX?[z,y,x]:[x,y,z];
 for(const sign of [-1,1])for(let i=0;i<n;i++){
  const a=Math.PI*i/n,c=Math.PI*(i+1)/n,z=sign*length/2,out=alongX?[sign,0,0]:[0,0,sign];
  face('stone',[xyz(r*Math.cos(a),y0+r*Math.sin(a),z),xyz(r*Math.cos(c),y0+r*Math.sin(c),z),xyz(inner*Math.cos(c),y0+inner*Math.sin(c),z),xyz(inner*Math.cos(a),y0+inner*Math.sin(a),z)],out);
  face('glass',[xyz(0,y0,z),xyz(inner*Math.cos(a),y0+inner*Math.sin(a),z),xyz(inner*Math.cos(c),y0+inner*Math.sin(c),z)],out);
 }
 for(let i=0;i<n;i++){const a=Math.PI*i/n,c=Math.PI*(i+1)/n;
  // The transverse barrel is only exposed outside the tall central shaft.
  const segments=alongX?[[-length/2,-22],[22,length/2]]:[[-length/2,length/2]];
  for(const[lo,hi]of segments)face('roof',[xyz(r*Math.cos(a),y0+r*Math.sin(a),lo),xyz(r*Math.cos(a),y0+r*Math.sin(a),hi),xyz(r*Math.cos(c),y0+r*Math.sin(c),hi),xyz(r*Math.cos(c),y0+r*Math.sin(c),lo)],alongX?[0,Math.sin((a+c)/2),Math.cos((a+c)/2)]:[Math.cos((a+c)/2),Math.sin((a+c)/2),0]);
 }
 }
 vault(22,62.3,217.88);vault(12,87.8,218,true);
 return flush(14*Math.PI/180,[6.72,-4.52]);
}
