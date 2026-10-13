import * as THREE from 'three';

export function kit(b, near) {
  const segments=near?16:8;
  const put=(g,mat)=>b.put(g,mat);
  function mesh(pos,idx,mat){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat);}
  function quad(mat,a,c,d,e){mesh([...a,...c,...d,...e],[0,1,2,0,2,3],mat);}
  function ring(r){let area=0;for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length];area+=a[0]*c[1]-c[0]*a[1];}return area<0?[...r].reverse():r;}
  function cap(mat,r,y,down=false){r=ring(r);const idx=THREE.ShapeUtils.triangulateShape(r.map(q=>new THREE.Vector2(...q)),[]).flatMap(t=>down?t:[t[2],t[1],t[0]]);mesh(r.flatMap(q=>[q[0],y,q[1]]),idx,mat);}
  function shell(mat,points,lo,hi,windows=false){
    const r=ring(points);
    for(let i=0;i<r.length;i++){
      const a=r[i],c=r[(i+1)%r.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),nx=dz/len,nz=-dx/len;
      const at=(x,y,inset=0)=>[a[0]+dx*x/len-nx*inset,y,a[1]+dz*x/len-nz*inset];
      const holes=[];
      const entry=Math.abs(a[1]+19.5)<.1&&Math.abs(c[1]+19.5)<.1;
      if(windows&&len>4){
        const wing=lo>3&&lo<4&&hi<15&&Math.abs(dz)<.12&&Math.max(a[1],c[1])< -21.4;
        const rows=entry?(hi<15?[[3.45,7.2]]:[]):hi<4?[[1.0,2.35]]:wing?[[3.95,8.4],[9.15,12.5]]:hi<15?[[4.35,7.85],[9.05,12.2]]:[[14.5,17.5]];
        const count=entry?3:wing?6:Math.max(1,Math.round(len/(near?3.05:6.1)));
        for(const [bottom,top] of rows)if(bottom>lo+.1&&top<hi-.15)for(let j=0;j<count;j++){
          const x=entry?(-6.75+j*4.5-a[0])*len/dx:(j+.5)*len/count,w=hi<4?1.05:entry?2.5:wing?2.25:1.65;
          holes.push([x-w/2,x+w/2,bottom,top]);
        }
      }
      const xs=[0,len,...holes.flatMap(h=>h.slice(0,2))].sort((a,c)=>a-c),ys=[lo,hi,...holes.flatMap(h=>h.slice(2)),...(entry&&lo<15.4&&hi>15.4?[15.4]:[])].sort((a,c)=>a-c);
      for(let xi=0;xi<xs.length-1;xi++)for(let yi=0;yi<ys.length-1;yi++){
        const l=xs[xi],rr=xs[xi+1],bot=ys[yi],top=ys[yi+1];if(rr-l<.001||top-bot<.001)continue;
        if(holes.some(h=>(l+rr)/2>h[0]&&(l+rr)/2<h[1]&&(bot+top)/2>h[2]&&(bot+top)/2<h[3]))continue;
        // The portico's shaded back wall reads darker than its exposed shafts in
        // the app's unlit material path as well as the lit asset inspector.
        quad(entry&&bot<15.4?'foundation':mat,at(l,bot),at(l,top),at(rr,top),at(rr,bot));
      }
      for(const [l,rr,bot,top]of holes){
        const dep=near?.28:.65;
        quad('glass',at(l,bot,dep),at(l,top,dep),at(rr,top,dep),at(rr,bot,dep));
        quad(mat,at(l,bot),at(l,bot,dep),at(l,top,dep),at(l,top));
        quad(mat,at(rr,bot,dep),at(rr,bot),at(rr,top),at(rr,top,dep));
        quad(mat,at(l,top),at(l,top,dep),at(rr,top,dep),at(rr,top));
        quad(mat,at(l,bot,dep),at(l,bot),at(rr,bot),at(rr,bot,dep));
        if(near){
          const mid=(l+rr)/2;
          quad(mat,at(mid-.055,bot,dep-.12),at(mid-.055,top,dep-.12),at(mid+.055,top,dep-.12),at(mid+.055,bot,dep-.12));
          quad(mat,at(l,(bot+top)/2-.055,dep-.12),at(l,(bot+top)/2+.055,dep-.12),at(rr,(bot+top)/2+.055,dep-.12),at(rr,(bot+top)/2-.055,dep-.12));
        }
      }
    }
  }
  function prism(mat,r,lo,hi,windows=false){shell(mat,r,lo,hi,windows);cap(mat,r,hi);if(lo>0)cap(mat,r,lo,true);}
  function drum(points,lo,hi){
    const r=ring(points);
    for(let i=0;i<r.length;i++){
      const a=r[i],c=r[(i+1)%r.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),nx=dz/len,nz=-dx/len;
      const wall=new THREE.Shape([new THREE.Vector2(0,lo),new THREE.Vector2(len,lo),new THREE.Vector2(len,hi),new THREE.Vector2(0,hi)]);
      const pts=[new THREE.Vector2(len/2-1.1,lo+.7),new THREE.Vector2(len/2+1.1,lo+.7)];
      for(let j=1;j<=(near?12:6);j++){const t=j*Math.PI/(near?12:6);pts.push(new THREE.Vector2(len/2+1.1*Math.cos(t),lo+.7+1.1*Math.sin(t)));}
      wall.holes.push(new THREE.Path(pts));
      function surface(shape,mat,dep){
        const g=new THREE.ShapeGeometry(shape),p=g.attributes.position;
        for(let j=0;j<p.count;j++){const x=p.getX(j),y=p.getY(j);p.setXYZ(j,a[0]+dx*x/len-nx*dep,y,a[1]+dz*x/len-nz*dep);}
        const idx=Array.from(g.index.array);for(let j=0;j<idx.length;j+=3)[idx[j+1],idx[j+2]]=[idx[j+2],idx[j+1]];g.setIndex(idx);g.computeVertexNormals();put(g,mat);
      }
      surface(wall,'stone',0);surface(new THREE.Shape(pts),'glass',near?.28:.65);
      // Closed reveal normals face the aperture, including the curved underside.
      const dep=near?.28:.65,at=(p,d)=>[a[0]+dx*p.x/len-nx*d,p.y,a[1]+dz*p.x/len-nz*d];
      for(let j=0;j<pts.length;j++){const q=pts[j],v=pts[(j+1)%pts.length];quad('stone',at(q,0),at(v,0),at(v,dep),at(q,dep));}
    }
    cap('stone',r,hi);
  }
  function cyl(mat,x,z,lo,hi,r,rt=r,n=segments){put(new THREE.CylinderGeometry(rt,r,hi-lo,n).translate(x,(lo+hi)/2,z),mat);}
  function profile(mat,x,z,points,n=near?24:12){put(new THREE.LatheGeometry(points.map(([r,y])=>new THREE.Vector2(r,y)),n).translate(x,0,z),mat);}
  function pediment(x,z,w,lo,rise,depth,rim=.28){
    const r=[[x-w/2,lo],[x+w/2,lo],[x,lo+rise]],shape=new THREE.Shape(r.map(q=>new THREE.Vector2(...q)));
    put(new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false}).translate(0,0,z-depth/2),'stone');
    for(const sign of [-1,1])b.bar('stone',[x+sign*w/2,lo,z-depth/2-.10],[x,lo+rise,z-depth/2-.10],rim,rim+.04);
  }
  function column(x,z,lo=3.2,hi=15.4,r=.54,capital=true,mat='trim'){
    cyl(mat,x,z,lo,lo+.22,r*1.32);
    profile(mat,x,z,[[r*1.32,lo+.22],[r*1.3,lo+.36],[r,lo+.53],[r*.96,lo+.6],[r*.82,hi-.68],[r,hi-.60],[r,hi-.47]],near?12:mat==='stone'?6:8);
    if(capital){
      b.box(mat,[x,hi-.25,z],[r*2.9,.5,r*2.7]);
      for(const s of [-1,1])put(new THREE.TorusGeometry(r*.38,r*.11,near?5:3,near?10:mat==='stone'?4:6).translate(x+s*r*.98,hi-.30,z-r*.85),mat);
    }
  }
  function roof(r,lo,hi){
    r=ring(r);const minx=Math.min(...r.map(q=>q[0])),maxx=Math.max(...r.map(q=>q[0])),minz=Math.min(...r.map(q=>q[1])),maxz=Math.max(...r.map(q=>q[1]));
    const alongX=maxx-minx>maxz-minz;
    const a=alongX?[minx,(minz+maxz)/2]:[(minx+maxx)/2,minz],c=alongX?[maxx,(minz+maxz)/2]:[(minx+maxx)/2,maxz];
    // Ridge roof, closed ends, no interior seam faces.
    if(alongX){
      quad('copper',[minx,lo,minz],[minx,hi,a[1]],[maxx,hi,c[1]],[maxx,lo,minz]);
      quad('copper',[maxx,lo,maxz],[maxx,hi,c[1]],[minx,hi,a[1]],[minx,lo,maxz]);
      mesh([minx,lo,minz,minx,lo,maxz,minx,hi,a[1]],[0,1,2],'stone');mesh([maxx,lo,maxz,maxx,lo,minz,maxx,hi,c[1]],[0,1,2],'stone');
    }else{
      quad('copper',[minx,lo,maxz],[a[0],hi,maxz],[c[0],hi,minz],[minx,lo,minz]);
      quad('copper',[maxx,lo,minz],[c[0],hi,minz],[a[0],hi,maxz],[maxx,lo,maxz]);
      mesh([minx,lo,minz,c[0],hi,minz,maxx,lo,minz],[0,1,2],'stone');mesh([maxx,lo,maxz,a[0],hi,maxz,minx,lo,maxz],[0,1,2],'stone');
    }
  }
  return {put,mesh,quad,ring,cap,shell,prism,drum,cyl,profile,pediment,column,roof};
}
