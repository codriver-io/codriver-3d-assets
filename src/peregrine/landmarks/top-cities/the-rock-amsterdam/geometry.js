import {parts} from './the-rock-amsterdam-parts.js';
export function create({detail='near'}={}){
 const p=parts(detail),{near,face,rect,ellipse,cap,facade,prism,block,loft,cylinder,dome,gable,box,bar,put}=p;
const outline=[[27.9688,-16.1971],[29.8393,14.0263],[18.1198,13.6256],[-8.8491,22.0525],[-11.1617,13.3027],[-11.5698,6.5567],[-12.9233,6.6347],[-18.3987,-14.2267],[-12.7601,-14.0931],[-13.6443,-28.6315],[27.0369,-31.1919]],cx=5,cz=-4;
 prism('stone',outline,0,9,{pitch:4.5,rows:2,fraction:.72,sill:.25,roof:'roof'});
 const trunk=outline.map(([x,z])=>[cx+(x-cx)*.68,cz+(z-cz)*.68]);prism('metal',trunk,9,57,{pitch:2.1,rows:14,fraction:.89,sill:.09,roof:'roof'});
 // A heavy faceted dark crown cantilevers over the glazed trunk. Border heights form the jagged lower edge.
 const lows=[49,49,46,45,48,54,54,50,50,51,50],tops=[90,90,88,88,86,89,89,90,90,89,90];
 const lower=outline.map(([x,z],i)=>[cx+(x-cx)*(.80+(i%3)*.012),lows[i],cz+(z-cz)*(.80+(i%3)*.012)]),upper=outline.map(([x,z],i)=>[cx+(x-cx)*(.79+(i%4)*.009),tops[i],cz+(z-cz)*(.79+(i%4)*.009)]);
 const mix=(a,c,t)=>a.map((v,i)=>v+(c[i]-v)*t);
 for(let k=0;k<lower.length;k++){const kn=(k+1)%lower.length,A=lower[k],B=lower[kn],C=upper[kn],D=upper[k],out=[B[2]-A[2],0,A[0]-B[0]],nx=Math.max(1,Math.round(Math.hypot(B[0]-A[0],B[2]-A[2])/(near?2.6:4.5))),ny=near?12:6;
  const pt=(u,v)=>mix(mix(A,B,u),mix(D,C,u),v),patch=(m,u,v,a,c)=>face(m,[pt(u,a),pt(v,a),pt(v,c),pt(u,c)],out);
  const weights=Array.from({length:nx},(_,i)=>[.65,1.5,.9,1.9,.75,1.2][(i+k)%6]),sum=weights.reduce((a,b)=>a+b,0),cuts=[0];for(const w of weights)cuts.push(cuts.at(-1)+w/sum);cuts[nx]=1;
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const s=cuts[i],t=cuts[i+1],lo=j/ny,hi=(j+1)/ny,w=.38+.32*((i+j*3+k)%7)/6,h=.4+.35*((i*3+j+k)%5)/4,u=s+(1-w)*(t-s)/2,v=t-(1-w)*(t-s)/2,a=lo+(1-h)/(2*ny),c=hi-(1-h)/(2*ny);patch('stone',s,t,lo,a);patch('stone',s,t,c,hi);patch('stone',s,u,a,c);patch('glass',u,v,a,c);patch('stone',v,t,a,c);}
 }
 const center=[cx,89,cz];for(let k=0;k<upper.length;k++){const j=(k+1)%upper.length;face('roof',[upper[k],upper[j],center],[0,1,0]);face('stone',[lower[k],lower[j],[cx,51,cz]],[0,-1,0]);}
 
 return p.finish();
}
