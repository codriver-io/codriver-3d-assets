import {parts} from './vinoly-tower-amsterdam-parts.js';
export function create({detail='near'}={}){
 const p=parts(detail),{near,face,rect,ellipse,cap,facade,prism,block,loft,cylinder,dome,gable,skin,box,bar,put}=p;
const A=[[20.806,14.906],[-18.956,23.143],[-20.929,-9.184],[19.174,-11.633]],B=[[-20.929,-9.184],[19.174,-11.633],[20.235,6.468],[-19.466,14.227]],base=[[69.065,-14.761],[70.194,4.664],[63.732,5.978],[63.684,4.341],[39.946,5.889],[40.171,10.831],[20.806,14.906],[19.174,-11.633]];
 prism('metal',base,0,25.8,{pitch:2.4,rows:7,fraction:.87,sill:.14,roof:'roof'});
 // Continuous inset structural core supports the three curtain-wall components at their deep wrapping notches.
 const center=B.reduce((s,p)=>[s[0]+p[0]/B.length,s[1]+p[1]/B.length],[0,0]),core=B.map(([x,z])=>[center[0]+(x-center[0])*.7,center[1]+(z-center[1])*.7]);prism('metal',core,0,90.5);
 const cut1=[31,37,43,34],cut2=[62,57,67,72];
 skin('metal',A,0,cut1,{pitch:2.2,rows:9,fraction:.86,sill:.15,roof:'roof'});
 skin('metal',A,cut1.map(y=>y+2.2),cut2,{pitch:2.2,rows:8,fraction:.86,sill:.15,roof:'roof'});
 skin('metal',B,[cut2[2]+2.2,cut2[3]+2.2,cut2[0]+2.2,cut2[1]+2.2],91,{pitch:2.2,rows:7,fraction:.86,sill:.15,roof:'roof'});
 for(const ys of [cut1,cut2])for(let k=0;k<A.length;k++){
  const a=A[k],c=A[(k+1)%A.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),nx=-dz/len,nz=dx/len,N=near?28:14;
  const stringer=t=>[a[0]+dx*t+nx*1.25,ys[k]+(ys[(k+1)%A.length]-ys[k])*t-.22,a[1]+dz*t+nz*1.25];bar('stair',stringer(1.5/N),stringer((N-1.5)/N),.24,.24);
  for(let j=1;j<N-1;j++){const s=j/N,t=(j+1)/N,y=ys[k]+(ys[(k+1)%A.length]-ys[k])*(j+.5)/N;const r=[[a[0]+dx*s+nx*.65,a[1]+dz*s+nz*.65],[a[0]+dx*t+nx*.65,a[1]+dz*t+nz*.65],[a[0]+dx*t+nx*1.85,a[1]+dz*t+nz*1.85],[a[0]+dx*s+nx*1.85,a[1]+dz*s+nz*1.85]];prism('stair',r,y-.2,y+.2);}
 }
 
 return p.finish();
}
