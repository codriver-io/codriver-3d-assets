import*as THREE from'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{PARTS}from'./footprint.js';import{kit}from'./20-fenchurch-street-geometry-kit.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,THREE),n=near?64:32,cos=Math.cos(SPEC.origin[1]*Math.PI/180),angle=.169,ex=[Math.cos(angle),Math.sin(angle)],ez=[-ex[1],ex[0]];
 const part=id=>PARTS.find(p=>p.id===id),ring=id=>part(id).ring.slice(0,-1).map(([x,y])=>[(x-SPEC.origin[0])*111320*cos,(SPEC.origin[1]-y)*111320]);
 function radial(rings){return Array.from({length:n},(_,i)=>{const t=2*Math.PI*i/n,dx=Math.cos(t),dz=Math.sin(t);let far=0;for(const r of rings)for(let j=0;j<r.length;j++){const a=r[j],c=r[(j+1)%r.length],vx=c[0]-a[0],vz=c[1]-a[1],den=dx*vz-dz*vx;if(Math.abs(den)<1e-9)continue;const d=(a[0]*vz-a[1]*vx)/den,u=(a[0]*dz-a[1]*dx)/den;if(d>=0&&u>=-1e-7&&u<=1+1e-7)far=Math.max(far,d);}return[dx*far,dz*far];});}
 const profiles=[{y:0,r:radial([ring(365920476),ring(365920473),ring(365920474)])},{y:7.7,r:radial([ring(365920476),ring(365920473),ring(365920474)])}];
 for(let id=949000356;id>=949000311;id-=3)profiles.push({y:part(id).height,r:radial([id,id+1,id+2].filter(part).map(ring))});
 // The deleted low-storey side-strip ways are interpolated from the next mapped profile.
 profiles[2].r=profiles[1].r.map((p,i)=>{const t=(profiles[2].y-profiles[1].y)/(profiles[3].y-profiles[1].y);return[p[0]+(profiles[3].r[i][0]-p[0])*t,p[1]+(profiles[3].r[i][1]-p[1])*t];});
 function sample(y){let j=profiles.findIndex(p=>p.y>=y);if(j<=0)return profiles[0].r;if(j<0)return profiles.at(-1).r;const a=profiles[j-1],c=profiles[j],t=(y-a.y)/(c.y-a.y);return a.r.map((p,i)=>[p[0]+(c.r[i][0]-p[0])*t,p[1]+(c.r[i][1]-p[1])*t]);}
 const rows=near?35:18;
 for(let v=0;v<rows;v++){const y=134.75*v/rows,z=134.75*(v+1)/rows,band=near?.35:.7,low=sample(y),mid=sample(y+band),high=sample(z);
  for(let i=0;i<n;i++){const j=(i+1)%n,a=low[i],c=low[j],out=[(a[0]+c[0])/2,0,(a[1]+c[1])/2],side=Math.abs(out[0]*ex[0]+out[2]*ex[1])>Math.abs(out[0]*ez[0]+out[2]*ez[1])*.95,pad=side?(near?.18:.14):(near?.035:.05),p=(r,s,h)=>[r[i][0]+(r[j][0]-r[i][0])*s,h,r[i][1]+(r[j][1]-r[i][1])*s];
   k.face(near?'band':'frame',[[a[0],y,a[1]],[c[0],y,c[1]],[mid[j][0],y+band,mid[j][1]],[mid[i][0],y+band,mid[i][1]]],out);
   for(const[mat,s,t]of[['frame',0,pad],['glass',pad,1-pad],['frame',1-pad,1]])k.face(mat,[p(mid,s,y+band),p(mid,t,y+band),p(high,t,z),p(high,s,z)],out);
  }
 }
 k.cap('base',profiles[0].r,0,false);const bottom=sample(134.75),roof=radial([ring(201247295)]),uv=p=>[p[0]*ex[0]+p[1]*ex[1],p[0]*ez[0]+p[1]*ez[1]],roofUV=roof.map(uv),minU=Math.min(...roofUV.map(p=>p[0])),maxU=Math.max(...roofUV.map(p=>p[0])),midU=(minU+maxU)/2,half=(maxU-minU)/2;
 const height=u=>142.45+17.65*Math.pow(Math.max(0,1-((u-midU)/half)**2),.6);
 // Sky Garden: a dark lower mechanical row, brighter arched glazing and horizontal transoms.
 for(let i=0;i<n;i++){const j=(i+1)%n,a=roof[i],c=roof[j],ha=height(uv(a)[0]),hc=height(uv(c)[0]),out=[(a[0]+c[0])/2,0,(a[1]+c[1])/2],edge=(t,h)=>[a[0]+(c[0]-a[0])*t,h,a[1]+(c[1]-a[1])*t],top=t=>ha+(hc-ha)*t-2,low=t=>Math.min(142.45,top(t)),level=(v,t)=>v===0?134.75:v===1?low(t):v===2?(low(t)+top(t))/2:top(t),at=(t,y)=>{const r=(y-134.75)/(top(t)-134.75),A=[bottom[i][0]+(bottom[j][0]-bottom[i][0])*t,bottom[i][1]+(bottom[j][1]-bottom[i][1])*t],B=edge(t,y);return[A[0]+(B[0]-A[0])*r,y,A[1]+(B[2]-A[1])*r];};
  for(let v=0;v<3;v++){
   const lo=t=>level(v,t),hi=t=>level(v+1,t),band=t=>Math.min(hi(t),lo(t)+.28);
   k.face('frame',[at(0,lo(0)),at(1,lo(1)),at(1,band(1)),at(0,band(0))],out);
   for(const[mat,u,w]of[['frame',0,.06],[v===0?'glass':'roofglass',.06,.94],['frame',.94,1]])k.face(mat,[at(u,band(u)),at(w,band(w)),at(w,hi(w)),at(u,hi(u))],out);
  }
  k.face('roofFrame',[edge(0,ha-2),edge(1,hc-2),edge(1,hc),edge(0,ha)],out);
 }
 // Curved canopy clipped to the mapped roof plan, with flush frame/pane partitions.
 function limits(u){const hits=[];for(let i=0;i<roofUV.length;i++){const a=roofUV[i],c=roofUV[(i+1)%roofUV.length];if((a[0]<=u&&c[0]>=u)||(c[0]<=u&&a[0]>=u)){const t=(u-a[0])/(c[0]-a[0]||1);if(t>=0&&t<=1)hits.push([a[1]+(c[1]-a[1])*t,height(a[0])+(height(c[0])-height(a[0]))*t]);}}hits.sort((a,c)=>a[0]-c[0]);return[hits[0],hits.at(-1)];}
 const nu=near?32:16,nv=near?10:5,us=[...new Set([...roofUV.map(p=>p[0]),...Array.from({length:nu+1},(_,i)=>minU+(maxU-minU)*i/nu)])].sort((a,c)=>a-c),xyz=(u,t)=>{const[a,c]=limits(u),v=a[0]+(c[0]-a[0])*t,edgeY=a[1]+(c[1]-a[1])*t,y=edgeY+Math.sin(Math.PI*t)*Math.max(0,height(u)-edgeY);return[u*ex[0]+v*ez[0],y,u*ex[1]+v*ez[1]];};
 for(let i=0;i<us.length-1;i++){const u=us[i]+.000001,w=us[i+1]-.000001;if(w<=u)continue;for(let j=0;j<nv;j++){const s=j/nv,t=(j+1)/nv;k.face(i%5===0||j===0||j===nv-1?'roofFrame':'roofglass',[xyz(u,s),xyz(w,s),xyz(w,t),xyz(u,t)],[0,1,0]);}}

 k.flush();return b.finish();
}
