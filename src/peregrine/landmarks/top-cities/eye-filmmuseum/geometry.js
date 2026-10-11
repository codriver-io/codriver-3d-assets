import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SurfaceMesh, normal, offset, panelJoints } from './eye-filmmuseum-mesh.js';

const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
export const mapped = (ring, i, y = 0) => { const [lng, lat] = FOOTPRINTS[ring][i]; return [(lngToMercX(lng)-ox)/k, y, (-latToMercY(lat)-oz)/k]; };
const lerp = (p, q, t) => p.map((a,i) => a+(q[i]-a)*t);
const withY = (p,y) => [p[0],y,p[2]];

// OSM gives the irregular shell, its recessed core and the long entrance stair
// independently. Heights follow the waterfront photograph and DMAA's section.
// All coordinates are already east/up/south; no additional host rotation.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const soups = new Map();
  const upperBars=[];
  const s = m => { if(!soups.has(m))soups.set(m,new SurfaceMesh());return soups.get(m); };
  const surface = (m, ps, n, joints = false, holes = []) => {
    const before = s(m).positions.length; s(m).poly(ps,n,holes);
    if(near && joints) for(let i=before;i<s(m).positions.length;i+=9) {
      const p=s(m).positions.slice(i,i+9),triangle=[p.slice(0,3),p.slice(3,6),p.slice(6,9)];
      panelJoints(s('joints'),triangle,normal(...triangle));
    }
  };
  const roofMat = near ? 'roof' : 'shell';
  const R = Object.fromEntries([[18,15.5],[19,17.5],[22,18.4],[23,24.5],[0,25],[1,25],[5,21.5],[12,18],[14,15.8],[15,13],[16,12],[17,12.8]].map(([i,y])=>[i,mapped(0,i,y)]));
  // Two inward folds break the bent roof into large crystalline planes.
  const Q=lerp(mapped(0,17),mapped(0,22),0.52);Q[1]=12.4;
  const T=lerp(mapped(0,14),mapped(0,23),0.55);T[1]=19.2;
  for(const ps of [
    [R[18],R[19],Q],[R[19],R[22],Q],[R[22],T,Q],
    [R[22],R[23],T],[R[23],R[0],T],[R[0],R[1],T],
    [R[1],R[5],T],[R[5],R[12],T],[R[12],R[14],T],
    [R[14],R[15],Q,T],[R[15],R[16],Q],[R[16],R[17],Q],[R[17],R[18],Q],
  ]) { let n=normal(...ps);if(n[1]<0)n=n.map(v=>-v);surface(roofMat,ps,n,true); }

  const front=[16,15,14,12,5,1], lips=[9.5,10.5,12.1,13.4,17.1,19.5];
  const lengths=[0];for(let i=1;i<front.length;i++)lengths.push(lengths[i-1]+Math.hypot(R[front[i]][0]-R[front[i-1]][0],R[front[i]][2]-R[front[i-1]][2]));
  const total=lengths.at(-1), diagonal=t=>5.5+Math.max(0,t-33)*14/(total-33), bottom=t=>diagonal(t)-1.65;
  const outerBottom = new Map();
  front.forEach((j,i)=>outerBottom.set(j,withY(R[j],bottom(lengths[i]))));
  for(let i=0;i<front.length-1;i++) {
    const a=R[front[i]],c=R[front[i+1]], L=lengths[i], H=lengths[i+1], n=[-(c[2]-a[2])/(H-L),0,(c[0]-a[0])/(H-L)];
    const pt=(t,y,d=0)=>offset(withY(lerp(a,c,(t-L)/(H-L)),y),n,d);
    const lip=t=>lips[i]+(lips[i+1]-lips[i])*(t-L)/(H-L);
    // The white brow is a real solid above a recessed aperture. A narrow
    // slanted window pierces the eastern prow's otherwise blank cladding.
    const band=[pt(L,lip(L)),pt(H,lip(H)),c,a];
    let hole=[];
    if(i===front.length-2) {
      const h0=L+(H-L)*0.24,h1=L+(H-L)*0.34;
      const roofAt=t=>a[1]+(c[1]-a[1])*(t-L)/(H-L);
      hole=[pt(h0,lip(h0)+0.5),pt(h1,lip(h1)+0.5),pt(h1+1.2,roofAt(h1+1.2)-0.25),pt(h0+1.2,roofAt(h0+1.2)-0.25)];
      surface('glass',hole.map(p=>offset(p,n,-0.22)),n);
      for(let j=0;j<4;j++) surface('soffit',[hole[j],hole[(j+1)%4],offset(hole[(j+1)%4],n,-0.22),offset(hole[j],n,-0.22)],normal(hole[j],hole[(j+1)%4],offset(hole[(j+1)%4],n,-0.22)));
    }
    surface('shell',band,n,true,hole.length?[hole]:[]);
    // The diagonal ribbon keeps a large wedge of glass visible below it too.
    const cuts=[L,H,...[7,12,33].filter(t=>t>L&&t<H)].sort((u,v)=>u-v);
    for(let j=0;j<cuts.length-1;j++) {
      const t0=cuts[j],t1=cuts[j+1], d0=diagonal(t0),d1=diagonal(t1);
      surface('shell',[pt(t0,bottom(t0)),pt(t1,bottom(t1)),pt(t1,d1),pt(t0,d0)],n,true);
      if(t1<=7)surface('shell',[pt(t0,d0),pt(t1,d1),pt(t1,lip(t1)),pt(t0,lip(t0))],n,true);
      else {
        // Chamfered west end of the long eye-shaped opening.
        const low=t=>t<12?lip(7)+(diagonal(12)-lip(7))*(t-7)/5:diagonal(t);
        if(t0<12)surface('shell',[pt(t0,d0),pt(t1,d1),pt(t1,low(t1)),pt(t0,low(t0))],n,true);
        const lo0=low(t0),lo1=low(t1),off=-3.1;
        if(lip(t0)>lo0+0.01 || lip(t1)>lo1+0.01) {
          surface('light',[pt(t0,lo0,off),pt(t1,lo1,off),pt(t1,lip(t1),off),pt(t0,lip(t0),off)],n);
          surface('soffit',[pt(t0,lip(t0)),pt(t1,lip(t1)),pt(t1,lip(t1),off),pt(t0,lip(t0),off)],[0,-1,0]);
          surface('shell',[pt(t0,lo0),pt(t1,lo1),pt(t1,lo1,off),pt(t0,lo0,off)],[0,1,0]);
          if(t0===7)surface('soffit',[pt(t0,lo0),pt(t0,lip(t0)),pt(t0,lip(t0),off),pt(t0,lo0,off)],[-1,0,0]);
          if(near) {
            for(let t=Math.ceil(t0/2.3)*2.3;t<t1;t+=2.3)if(lip(t)-low(t)>0.1)upperBars.push([pt(t,low(t),off+0.08),pt(t,lip(t),off+0.08),0.105]);
            // A glazing transom follows the gently rising upper lip.
            upperBars.push([pt(t0,(lo0+lip(t0))/2,off+0.08),pt(t1,(lo1+lip(t1))/2,off+0.08),0.1]);
          }
        }
      }
    }
  }

  // Closed back/side shell. The eastern underside rises well clear of grade;
  // its structural core meets it inboard, preserving the projecting prow.
  const rear=[16,17,18,19,22,23,0,1], levels=[bottom(0),2,0,0,3.7,12.5,17.85,bottom(total)];
  for(let i=0;i<rear.length;i++)outerBottom.set(rear[i],withY(R[rear[i]],levels[i]));
  for(let i=0;i<rear.length-1;i++) {
    const a=R[rear[i]],c=R[rear[i+1]],a0=outerBottom.get(rear[i]),c0=outerBottom.get(rear[i+1]);
    const dx=c[0]-a[0],dz=c[2]-a[2],len=Math.hypot(dx,dz),n=[-dz/len,0,dx/len];
    // Reverse traversal of the shell's back chain makes the outside right.
    surface('shell',[a0,c0,c,a],n.map(v=>-v),true);
  }
  const boundary=[16,15,14,12,5,1,0,23,22,19,18,17].map(j=>outerBottom.get(j));
  const under=lerp(mapped(0,14),mapped(0,22),0.5);under[1]=4.3;
  for(let i=0;i<boundary.length;i++) {const ps=[boundary[i],boundary[(i+1)%boundary.length],under];let n=normal(...ps);if(n[1]>0)n=n.map(v=>-v);surface('soffit',ps,n);}

  // The tip is not a vertical end wall: the lower edge is swept back 4.5 m,
  // leaving the top edge as the sharp eastern prow. This is an estimated bevel
  // of the upper shell only; the core and the stair keep their mapped positions.
  const tip=R[1][0];
  const bevel=p=>{const w=Math.max(0,Math.min(1,(p[0]-(tip-15))/15)),down=Math.max(0,Math.min(1,(25-p[1])/7.2));return [p[0]-4.5*w*down,p[1],p[2]];};
  for(const soup of soups.values())for(let i=0;i<soup.positions.length;i+=3) {
    soup.positions[i]=bevel(soup.positions.slice(i,i+3))[0];
  }
  for(const [a,c,w] of upperBars)b.bar('steel',bevel(a),bevel(c),w);

  // Recessed lower-storey glass on the mapped core, not a footprint extrusion.
  const coreIndices=[0,3,6,11,14,19,20,23,24,30,31,33,34];
  const core=coreIndices.map(j=>mapped(1,j));
  for(let i=0;i<core.length;i++) {
    const a=core[i],c=core[(i+1)%core.length],dx=c[0]-a[0],dz=c[2]-a[2],len=Math.hypot(dx,dz),n=[dz/len,0,-dx/len];
    surface('glass',[a,c,withY(c,0.65),withY(a,0.65)],n);
    surface('light',[withY(a,0.65),withY(c,0.65),withY(c,3.55),withY(a,3.55)],n);
    surface('glass',[withY(a,3.55),withY(c,3.55),withY(c,4.1),withY(a,4.1)],n);
    if(near)for(let t=0;t<len;t+=2.4) {const p=offset(lerp(a,c,t/len),n,0.07);b.bar('steel',withY(p,0),withY(p,4.1),0.1);}
  }
  surface('concrete',core.map(p=>withY(p,4.1)),[0,1,0]);
  surface('concrete',core,[0,-1,0]);
  // Core of the projecting eastern cinema, set back from the end cap.
  const pier=[mapped(1,23),mapped(1,24),mapped(1,30),mapped(1,20)];
  for(let i=0;i<pier.length;i++){const a=pier[i],c=pier[(i+1)%pier.length],dx=c[0]-a[0],dz=c[2]-a[2],l=Math.hypot(dx,dz);surface('glass',[withY(a,4.25),withY(c,4.25),withY(c,15.5),withY(a,15.5)],[dz/l,0,-dx/l]);}
  surface('glass',pier.map(p=>withY(p,15.5)),[0,1,0]);

  // Long eastern access stair: the mapped narrow promenade wing rises 4.2 m.
  const lowA=mapped(2,4),lowB=mapped(2,8),highA=mapped(2,0),highB=mapped(2,10);
  const low=lerp(lowA,lowB,0.5),high=lerp(highA,highB,0.5),dx=high[0]-low[0],dz=high[2]-low[2],len=Math.hypot(dx,dz),n=[-dz/len,0,dx/len];
  const stepCount=near?28:7,width=2;
  const stairPt=(t,y,d)=>withY(lerp(lerp(lowA,highA,t),lerp(lowB,highB,t),(d+1)/2),y);
  for(let i=0;i<stepCount;i++) {
    const t=i/stepCount,t1=(i+1)/stepCount,y=4.1*t1;
    surface('concrete',[stairPt(t,y,-width/2),stairPt(t1,y,-width/2),stairPt(t1,y,width/2),stairPt(t,y,width/2)],[0,1,0]);
    surface('concrete',[stairPt(t,4.1*t,-width/2),stairPt(t,4.1*t,width/2),stairPt(t,y,width/2),stairPt(t,y,-width/2)],[-dx/len,0,-dz/len]);
  }
  for(const d of [-width/2,width/2]) {
    surface('shell',[stairPt(0,0,d),stairPt(1,0,d),stairPt(1,4.1,d)],n.map(v=>v*Math.sign(d)));
    b.bar(near?'steel':'glass',stairPt(0,0.9,d*0.95),stairPt(1,5,d*0.95),0.08);
    if(near)for(let i=0;i<=14;i++)b.bar('steel',stairPt(i/14,4.1*i/14,d*0.95),stairPt(i/14,4.1*i/14+0.9,d*0.95),0.065);
  }
  surface('concrete',[stairPt(1,0,-1),stairPt(1,0,1),stairPt(1,4.1,1),stairPt(1,4.1,-1)],[dx/len,0,dz/len]);
  for(const [mat,soup] of soups)if(soup.positions.length)b.put(soup.geometry(),mat);
  return b.finish();
}
