import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{PARTS}from'./maison-de-la-radio-plan.js';import{local,simplify,surfaces}from'./maison-de-la-radio-parts.js';
export function connectorEnds(){return PARTS.filter(p=>p.connector).map(p=>{const ring=simplify(local(p.ring,SPEC.origin),.08);let best=[ring[0],ring[1]],distance=0;for(const a of ring)for(const c of ring){const d=Math.hypot(c[0]-a[0],c[1]-a[1]);if(d>distance){distance=d;best=[a,c];}}
 const axis=best[1].map((v,i)=>(v-best[0][i])/distance),projection=q=>q[0]*axis[0]+q[1]*axis[1],vs=ring.map(projection),lo=Math.min(...vs),hi=Math.max(...vs),avg=points=>points.reduce((s,q)=>s.map((v,i)=>v+q[i]/points.length),[0,0]);
 const a=avg(ring.filter(q=>projection(q)<lo+(hi-lo)*.06)),c=avg(ring.filter(q=>projection(q)>hi-(hi-lo)*.06));return{id:p.key,a:[a[0],16.5,a[1]],b:[c[0],16.5,c[1]],supports:'inner studio ring and outer office ring'};});}
export function create({detail='near',onlyPart=null}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b);
 for(const p of PARTS){if(onlyPart&&p.key!==onlyPart)continue;const plan=simplify(local(p.ring,SPEC.origin),near?.25:.45);let height=p.id===3071872?65:p.height;
 if(p.id===3071872){s.shell(plan,65,{pitch:near?3.1:6.2,bay:near?1.7:3.4,band:near?.35:.55,mullion:near?.6:1.1});continue;}
 if(p.connector){s.shell(plan,height,{bottom:p.bottom,windows:false,wall:'connector'});continue;}
 if(p.studio){s.shell(plan,height,{bottom:p.bottom,windows:false,wall:'studio'});continue;}
 if(height-p.bottom<=4){s.shell(plan,height,{bottom:p.bottom,pitch:height-p.bottom,bay:near?2.7:5.4,band:1.4,mullion:.13});continue;}
 const belt=height-3;
 s.shell(plan,belt,{capTop:false,bottom:p.bottom,pitch:near?3.1:6.2,bay:near?3.2:6.4,band:near?1.9:3.8,mullion:near?.75:1.35});
 s.shell(plan,height,{capBottom:false,bottom:belt,pitch:3,bay:near?3.2:6.4,band:.3,mullion:.15});
 }
 const model=s.finish();model.userData.identity='silver circular radio ring,raised links and central68 m tower';return model;
}
