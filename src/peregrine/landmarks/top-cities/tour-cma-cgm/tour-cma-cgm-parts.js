import * as THREE from 'three';
// Local editable surface utilities. Facades are partitioned tiles, never window
// decals over opaque walls; every tile shares its neighbours' vertices/plane.
export function surfaces(builder) {
  const groups = new Map();
  function tri(material,a,b,c){ if(!groups.has(material))groups.set(material,[]);groups.get(material).push(...a,...b,...c); }
  function quad(material,a,b,c,d){tri(material,a,b,c);tri(material,a,c,d);}
  function cap(plan,y,material='roof',up=true){
    const shape=plan.map(p=>new THREE.Vector2(...p));
    for(const t of THREE.ShapeUtils.triangulateShape(shape,[])){
      const points=(up?[...t].reverse():t).map(i=>[plan[i][0],typeof y==='function'?y(...plan[i]):y,plan[i][1]]);tri(material,...points);
    }
  }
  function shell(plan,top,{bottom=0,pitch=3.8,bay=2.2,wall='frame',glass='glass',band=.25,mullion=.12,windows=true,capTop=true,capBottom=bottom>0}={}){
    let p=plan.slice();
    if(p.length>2&&Math.hypot(p[0][0]-p.at(-1)[0],p[0][1]-p.at(-1)[1])<.001)p.pop();
    const area=p.reduce((a,v,i)=>{const w=p[(i+1)%p.length];return a+v[0]*w[1]-w[0]*v[1];},0);
    if(area<0)p.reverse();
    const ht=(x,z)=>typeof top==='function'?top(x,z):top;
    for(let side=0;side<p.length;side++){
      const a=p[side],c=p[(side+1)%p.length],length=Math.hypot(c[0]-a[0],c[1]-a[1]);
      if(length<.01)continue;
      const cols=Math.max(1,Math.round(length/bay));
      for(let col=0;col<cols;col++){
        const u0=col/cols,u1=(col+1)/cols,um=Math.min(u1,u0+mullion/length);
        const pos=(u,y)=>[a[0]+(c[0]-a[0])*u,y,a[1]+(c[1]-a[1])*u];
        function tile(mat,loU,hiU,loY,hiY){
          const A=pos(loU,0),C=pos(hiU,0),ha=Math.min(hiY,ht(A[0],A[2])),hc=Math.min(hiY,ht(C[0],C[2]));
          let poly=[[A[0],loY,A[2]],[C[0],loY,C[2]],[C[0],hiY,C[2]],[A[0],hiY,A[2]]];
          const clipped=[];
          for(let i=0;i<poly.length;i++){const v=poly[i],w=poly[(i+1)%poly.length],dv=ht(v[0],v[2])-v[1],dw=ht(w[0],w[2])-w[1];if(dv>=-1e-7)clipped.push(v);if((dv>=0)!==(dw>=0)){const t=dv/(dv-dw);clipped.push(v.map((x,k)=>x+t*(w[k]-x)));}}
          for(let i=1;i<clipped.length-1;i++){const v=clipped[0],w=clipped[i],z=clipped[i+1];if(new THREE.Vector3(...w).sub(new THREE.Vector3(...v)).cross(new THREE.Vector3(...z).sub(new THREE.Vector3(...v))).lengthSq()>1e-9)tri(mat,v,z,w);}
        }
        const max=Math.max(ht(...a),ht(...c));
        if(!windows){tile(wall,u0,u1,bottom,max);continue;}
        tile(wall,u0,um,bottom,max);
        for(let y=bottom;y<max;y+=pitch){tile(wall,um,u1,y,Math.min(max,y+band));tile(glass,um,u1,y+band,Math.min(max,y+pitch));}
      }
    }
    if(capTop)cap(p,top,'roof',true); if(capBottom)cap(p,bottom,wall,false);
  }
  function finish(){for(const[material,coords]of groups){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(coords,3));g.computeVertexNormals();builder.put(g,material);}return builder.finish();}
  return {tri,quad,cap,shell,finish};
}
export function local(ring,origin){return ring.map(([lng,lat])=>[(lng-origin[0])*111319.49079327358*Math.cos(origin[1]*Math.PI/180),-(lat-origin[1])*111319.49079327358]);}
export function simplify(plan,tolerance=.4){let p=plan.slice();if(Math.hypot(p[0][0]-p.at(-1)[0],p[0][1]-p.at(-1)[1])<.01)p.pop();let changed=true;while(changed&&p.length>4){changed=false;for(let i=0;i<p.length;i++){const a=p[(i+p.length-1)%p.length],v=p[i],c=p[(i+1)%p.length],d=Math.abs((c[0]-a[0])*(a[1]-v[1])-(a[0]-v[0])*(c[1]-a[1]))/Math.hypot(c[0]-a[0],c[1]-a[1]);if(d<tolerance){p.splice(i,1);changed=true;break;}}}return p;}
