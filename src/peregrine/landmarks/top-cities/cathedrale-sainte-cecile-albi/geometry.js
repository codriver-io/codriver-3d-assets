import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { kit } from './cathedrale-sainte-cecile-albi-kit.js';

// Roof control points (-39.93,-3.33), (41.45,-3.31) metres from the mapped anchor.
// Rotation is exported once; its very slight eastward south slope is not a street-grid assumption.
export const THETA=-Math.atan2(.02,81.38);
const C=6.5;
function outline(r,n,x0=-40) {
  const p=[[x0,C-r],[41,C-r]];
  for(let i=1;i<=n;i++){let a=-Math.PI/2+Math.PI*i/n;p.push([41+Math.cos(a)*r,C+Math.sin(a)*r]);}
  p.push([x0,C+r]);return p;
}
function hull(k) {
  const n=k.near?20:10;
  k.loft('brick',outline(16,n),outline(13.25,n),0,5);
  k.loft('brick',outline(13.25,n),outline(13.25,n),5,39.5);
  k.loft('trim',outline(13.55,n),outline(13.55,n),39.4,40.1);
  // Hipped tiled roof sunk behind the fortress parapet; ridge at mapped 44 m.
  k.loft('roof',outline(11.7,n,-39.75),outline(.12,n,-39.75),39.65,44);
  // The ridge is a visible tile roll, inset from the hipped east/west ends.
  k.box('roof',-38.9,40.3,43.8,44.12,C-.15,C+.15);
  for(const side of [-1,1]) {
    const z=C+side*13.25, angle=side>0?0:Math.PI;
    for(let i=0;i<=12;i++) {
      const x=-39.5+i*6.7;
      turret(k,x,z,2.65,40.5);
      if(i<12) {
        const u=x+3.35, plane=z+side*.15;
        k.panel('glow',u,18.5,plane,1.18,15.3,angle);
        if(k.near)k.arch('trim',u,18.35,plane+side*.18,1.65,15.8,.2,angle);
        k.panel('recess',u,6,plane,.78,6.7,angle);
        if(k.near) {
          k.arch('trim',u,5.85,plane+side*.18,1.1,7.1,.18,angle);
          k.b.bar('trim',[u,18.5,plane+side*.23],[u,30,plane+side*.23],.1);
          for(let j=0;j<5;j++) {
            const v=x+.65+j*1.1;
            k.panel('joint',v,36.3,plane,.7,2.15,angle,false);
            // The corbel void supplies the arcade rhythm; upper water table supplies its rim.
          }
        }
      }
    }
    // Continuous water table and a brick string course around the body.
    for(const y of [5.05,15.2,35.8])k.box('trim',-39.4,41.2,y,y+.22,z+Math.min(0,side*.28),z+Math.max(0,side*.28));
  }
  for(let i=1;i<6;i++) {
    const a=-Math.PI/2+Math.PI*i/6,x=41+Math.cos(a)*13.25,z=C+Math.sin(a)*13.25;
    turret(k,x,z,2.65,i===3?50:40.5);
    if(i===3) {k.cylinder('brick',x,z,40.4,50.08,1.5);k.cylinder('roof',x,z,50,55,1.65,0,8);}
    if(i<5) {
      const aa=a+Math.PI/12,xx=41+Math.cos(aa)*13.42,zz=C+Math.sin(aa)*13.42,angle=Math.PI/2-aa;
      k.panel('glow',xx,18.5,zz,1.15,15.3,angle);
      k.arch('trim',xx,18.35,zz,1.7,15.8,.2,angle);
    }
  }
  // Two eastern side turrets and their low pointed roofs.
  for(const z of [C-13.25,C+13.25]) {
    k.cylinder('brick',21.4,z,40.4,45,1.55);
    k.cylinder('roof',21.4,z,45,50,1.8,0,8);
  }
}
function turret(k,x,z,r,h) {
  k.cylinder('trim',x,z,0,5,r+.05,r*.94);
  k.cylinder('trim',x,z,4.85,h-.6,r*.94,r*.84);
  k.cylinder('trim',x,z,h-.65,h,r*.9,r*.9);
  for(const y of [5.1,15.3,35.9])k.ring('trim',x,y,z,r*(y>30?.86:.95)+.08,.23);
  if(k.near) {
    // Sparse relief courses convey the horizontal Foraine brickwork without textures.
    for(let y=8;y<h-1;y+=7.6)k.ring('joint',x,y,z,r*(.94-(y-5)/(h-5)*.1)+.024,.045);
  }
}
function chamfered(x,z,half,cut) {
  return [[x-half+cut,z-half],[x+half-cut,z-half],[x+half,z-half+cut],[x+half,z+half-cut],[x+half-cut,z+half],[x-half+cut,z+half],[x-half,z+half-cut],[x-half,z-half+cut]];
}
function tower(k) {
  // Photos 5/6: a massive square keep through the first gallery, not a drum.
  k.box('brick',-54.5,-39.9,0,49.65,C-7,C+7);
  for(const [y,h] of [[6,16],[25,12],[42,7.2]]) {
    const plane=-54.65;
    k.panel('joint',plane,y+.05,C,9.2,h-.1,-Math.PI/2,false);
    k.arch('trim',plane-.15,y,C,9.5,h,.48,-Math.PI/2,false);
  }
  // Half-round corner buttresses are the round parts of this square keep.
  for(const x of [-53,-42.3])for(const z of [1.15,11.85]) {
    turret(k,x,z,3.35,x<-50?41:40);
    if(x<-50){k.cylinder('brick',x,z,40.9,49,1.4);k.cylinder('roof',x,z,49,50,1.6,.3,8);}
    else {
      for(const [lo,hi,r] of [[39.8,58,2.95],[57.9,66,2.5],[65.9,72,2.05],[71.9,77,1.7]]) {
        k.cylinder('brick',x,z,lo,hi,r,r*.9);k.cylinder('trim',x,z,hi-.35,hi+.1,r*1.03,r*1.03);
      }
      k.cylinder('roof',x,z,77,78,1.65,0,8);
    }
  }
  // Short square gallery below two chamfered/octagonal belfry stages.
  // Only cardinal faces have a tall pair: the old wrap of 16 slots read like a drum.
  for(const [y0,y1,half,cut] of [[49.6,58,5.75,.15],[57.8,66,5.3,1.5],[65.8,77,4.8,1.4]]) {
    k.loft('brick',chamfered(-47.15,C,half,cut),chamfered(-47.15,C,half,cut),y0,y1);
    k.loft('trim',chamfered(-47.15,C,half+.15,cut),chamfered(-47.15,C,half+.15,cut),y1-.35,y1+.1);
    for(let i=0;i<4;i++) {
      const a=i*Math.PI/2,angle=Math.PI/2-a;
      for(const d of [-.95,.95]) {
        const x=-47.15+Math.cos(a)*(half+.13)-Math.sin(a)*d,z=C+Math.sin(a)*(half+.13)+Math.cos(a)*d;
        const y=y0+(y1-y0)*.23,h=(y1-y0)*.66,w=1.3;
        k.panel('recess',x,y,z,w,h,angle,false);
        if(k.near)k.arch('trim',x+Math.cos(a)*.16,y-.1,z+Math.sin(a)*.16,w+.25,h+.25,.22,angle,false);
        if(k.near)for(let yy=y+.35;yy<y+h-.8;yy+=1)k.b.bar('joint',[x-.48*Math.sin(a),yy,z+.48*Math.cos(a)],[x+.48*Math.sin(a),yy,z-.48*Math.cos(a)],.1);
      }
    }
  }
  k.loft('roof',chamfered(-47.15,C,4.8,1.4),chamfered(-47.15,C,.08,.02),77,78);
  for(const y of [22,40.5,49.5])k.box('trim',-54.85,-39.6,y,y+.4,C-7.2,C+7.2);
  if(k.near)for(let z=C-5.5;z<=C+5.5;z+=1.1)k.arch('trim',-54.72,37.5,z,.85,2,.18,-Math.PI/2,false);
}
function porch(k) {
  // Pale flamboyant south baldaquin: floor on a fortified stair, OPEN on three sides.
  k.box('brick',-5.7,2.6,0,3,C+13.2,29.5);
  const step=k.near?10:5;
  for(let i=0;i<step;i++)k.box('brick',-5.4,2.3,0,3*(i+1)/step,30.3-i*.35*(10/step),30.7-i*.35*(10/step));
  const zs=[20,29.1],xs=[-5.1,1.9];
  for(const x of xs)for(const z of zs) {
    // Solid stone pier core makes the porch read at street range.
    k.box('stone',x-.61,x+.61,3,13.35,z-.61,z+.61);
    k.cylinder('stone',x,z,3.03,13.5,.67,.56,8);
    k.box('stone',x-.6,x+.6,12.9,13.5,z-.6,z+.6);
    k.pin(x,z,13.3,20.3,.34);
    if(k.near)k.pin(x+.45,z,5.5,16.7,.15);
  }
  k.arch('stone',-1.6,3,29.1,7,10.3,.88,0,false);
  for(const x of xs)k.arch('stone',x,3,24.55,9.1,10.3,.72,Math.PI/2,false);
  // Broad stone gable and spandrels support relief tracery; arcade below stays open.
  k.gable('stone',-1.6,29.25,8.05,13.22,15.45,19.4,.45);
  for(const x of xs)k.box('stone',x-.28,x+.28,13.23,15.5,20.1,29.35);
  for(const x of [-3.35,.15]) {
    k.panel('recess',x,13.65,29.78,2.45,1.8);
    k.arch('stone',x,13.55,29.98,2.7,2.05,.25);
    if(k.near)for(const dx of [-.65,.65])k.arch('stone',x+dx,13.8,30.02,1.05,1.35,.13);
    k.b.bar('stone',[x-1.55,15.4,29.94],[x,18,29.94],.3);
    k.b.bar('stone',[x,18,29.94],[x+1.55,15.4,29.94],.3);
  }
  // Upper pierced tracery behind the solid front gable remains visible from the side.
  for(const z of zs) {
    for(const y of [13.3,15.4]) {
      k.b.bar('stone',[-5.1,y,z],[1.9,y,z],.22);
      for(const x of [-3.35,.15]) {
        k.arch('stone',x,y,z,3.2,2.1,.18,0);
        if(k.near)for(const dx of [-.65,.65])k.arch('stone',x+dx,y+.2,z,1.1,1.25,.11,0);
      }
    }
    for(const x of [-3.35,.15]) {
      k.b.bar('stone',[x-1.7,15.5,z],[x,18,z],.2);k.b.bar('stone',[x,18,z],[x+1.7,15.5,z],.2);k.pin(x,z,17.7,19.2,.14);
    }
  }
  for(const x of xs)for(const y of [13.3,15.4]) {
    k.b.bar('stone',[x,y,20],[x,y,29.1],.22);
    for(const z of [22.2,26.8])k.arch('stone',x,y,z,4.3,2.2,.18,Math.PI/2);
  }
  // Open star vault rib web attached to the four columns; no solid canopy box.
  for(const x of xs)for(const z of zs)k.b.bar('stone',[x,12.8,z],[-1.6,14.1,24.55],.2);
  k.panel('recess',-1.6,3.1,20.02,3.6,7.4,0);
  k.arch('stone',-1.6,3,20.23,4.3,8,.3);
}
function ancillary(k) {
  // Only attached cathedral sacristy; Palais de la Berbie is outside the model.
  k.box('brick',22.25,40.6,0,24,-31.65,-6.5);
  k.loft('roof',[[22.25,-31.65],[40.6,-31.65],[40.6,-7],[22.25,-7]],[[22.25,-20],[40.6,-20],[40.6,-19.65],[22.25,-19.65]],23.9,25);
  for(let x=25;x<40;x+=4.5){k.panel('recess',x,9,-31.8,1.2,7,Math.PI);if(k.near)k.arch('trim',x,8.9,-31.95,1.7,7.3,.18,Math.PI);}
  k.cylinder('brick',40.1,-30.5,0,30,1.25);k.cylinder('roof',40.1,-30.5,30,34,1.4,0,8);
  // Southeast Dominique-de-Florence gate and stairs in its own narrow mapped spur.
  k.box('brick',25.7,31.65,0,3.4,23,30.5);
  for(const x of [26.3,31.1])k.cylinder('brick',x,30.5,3.35,10.5,.45);
  k.arch('trim',28.7,3.4,30.5,4.8,7.2,.28);
  k.b.bar('trim',[26.3,10.5,30.5],[31.1,10.5,30.5],.25);
  if(k.near)for(let x=26.6;x<31;x+=.65)k.arch('trim',x,8.8,30.6,.55,1.5,.09);
}
export function create({detail='near'}={}) {
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,detail==='near');
  hull(k);tower(k);porch(k);ancillary(k);
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');o.geometry.translate(0,0,-C);o.geometry.rotateY(THETA);o.geometry.translate(0,0,C);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  return root;
}
