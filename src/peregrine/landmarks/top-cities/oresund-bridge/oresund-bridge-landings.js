// HD replacement clips in relative-height space; the caller restores its
// original ground buffer, which has no entries for newly appended cut vertices.
// Capture before clipping, then interpolate that same buffer from the original
// triangle after the caller restores it. This preserves the provider datum,
// bank interpolation and all existing dash/style attributes exactly.
export function captureCutDatum(geometry){
  return {positions:geometry.attributes.position.array.slice(),indices:geometry.index?.array.slice()};
}
export function restoreCutDatum(geometry,datum){
  if(!datum.indices)return 0;
  const a=geometry.attributes.position,source=datum.positions,count=source.length/3;
  datum.cutY??=Array.from({length:a.count-count},(_,i)=>a.getY(count+i));
  let fixed=0;
  for(let i=count;i<a.count;i++){
    const x=a.getX(i),z=a.getZ(i),y=datum.cutY[i-count];
    for(let j=0;j<datum.indices.length;j+=3){
      const ia=datum.indices[j],ib=datum.indices[j+1],ic=datum.indices[j+2];
      const ax=source[ia*3],az=source[ia*3+2],bx=source[ib*3],bz=source[ib*3+2],cx=source[ic*3],cz=source[ic*3+2];
      if(x<Math.min(ax,bx,cx)-.001||x>Math.max(ax,bx,cx)+.001||z<Math.min(az,bz,cz)-.001||z>Math.max(az,bz,cz)+.001)continue;
      const det=(bx-ax)*(cz-az)-(cx-ax)*(bz-az);
      if(Math.abs(det)<1e-8){
        // Shader-extruded paint/walls have collinear stored positions.
        // Their ground is still linear along the longest source edge.
        const pairs=[[ia,ib],[ib,ic],[ic,ia]].sort(([u,v],[w,t])=>Math.hypot(source[w*3]-source[t*3],source[w*3+2]-source[t*3+2])-Math.hypot(source[u*3]-source[v*3],source[u*3+2]-source[v*3+2]));
        const [u,v]=pairs[0],dx=source[v*3]-source[u*3],dz=source[v*3+2]-source[u*3+2],length2=dx*dx+dz*dz;
        if(length2<1e-8)continue;
        const t=((x-source[u*3])*dx+(z-source[u*3+2])*dz)/length2;
        if(t<-.0001||t>1.0001||Math.hypot(x-source[u*3]-t*dx,z-source[u*3+2]-t*dz)>.002)continue;
        if(y<Math.min(source[ia*3+1],source[ib*3+1],source[ic*3+1])-.005||y>Math.max(source[ia*3+1],source[ib*3+1],source[ic*3+1])+.005)continue;
        const style=geometry.attributes.aStyle,color=geometry.attributes.aColor;
        if((style&&Math.abs(style.getX(i)-style.getX(ia))>.01)||(color&&Math.abs(color.getX(i)-color.getX(ia))>.01))continue;
        a.setY(i,y+(1-t)*(a.getY(u)-source[u*3+1])+t*(a.getY(v)-source[v*3+1]));fixed++;break;
      }
      const b=((x-ax)*(cz-az)-(cx-ax)*(z-az))/det,c=((bx-ax)*(z-az)-(x-ax)*(bz-az))/det,v=1-b-c;
      if(Math.min(v,b,c)<-.0001)continue;
      // Co-located surfaces/paint/structural faces can share x/z. Select
      // the actual relative-height triangle that produced this cut.
      if(Math.abs(v*source[ia*3+1]+b*source[ib*3+1]+c*source[ic*3+1]-y)>.005)continue;
      const ground=v*(a.getY(ia)-source[ia*3+1])+b*(a.getY(ib)-source[ib*3+1])+c*(a.getY(ic)-source[ic*3+1]);
      a.setY(i,y+ground);fixed++;break;
    }
  }
  a.needsUpdate=true;geometry.computeBoundingBox();geometry.computeBoundingSphere();return fixed;
}
