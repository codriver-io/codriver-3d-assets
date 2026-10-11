import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../facade/geo.js';

/** One metric frame shared by authoring, HD surfaces and navigation. */
export function createBridgeProfile(spec) {
  const CHAMPLAIN = spec; // Contract name retained for existing Champlain operations.
  const STRETCH = mercStretch(spec.origin[1]);
  const ox = lngToMercX(spec.origin[0]), oz = -latToMercY(spec.origin[1]);
  const bridgeLocal = (lng, lat) => ({ x: (lngToMercX(lng) - ox) / STRETCH, z: (-latToMercY(lat) - oz) / STRETCH });
  const bridgeLngLat = (x, z) => [mercXToLng(ox + x * STRETCH), mercYToLat(-oz - z * STRETCH)];
  const ALIGNMENT = spec.centerline.map(p => bridgeLocal(...p));
  let BRIDGE_LENGTH = 0;
  ALIGNMENT.forEach((p, i) => { if (i) BRIDGE_LENGTH += Math.hypot(p.x - ALIGNMENT[i-1].x, p.z - ALIGNMENT[i-1].z); p.s = BRIDGE_LENGTH; });
  const halfWidth = spec.width / 2, railGap = spec.railGap || 0, ROAD_EDGES = spec.roadEdges;
  // Optional authored road edges that vary with the station (same shape as ROAD_EDGES), for an
  // approach whose carriageways separate (Golden Gate Bridge). Absent, the constant edges apply.
  const authoredEdges = spec.roadEdgesAt || (() => ROAD_EDGES);
  const bounds = { minX: Math.min(...ALIGNMENT.map(p => p.x)) - halfWidth, maxX: Math.max(...ALIGNMENT.map(p => p.x)) + halfWidth,
    minZ: Math.min(...ALIGNMENT.map(p => p.z)) - halfWidth, maxZ: Math.max(...ALIGNMENT.map(p => p.z)) + halfWidth };
  function projectBridge(x, z) {
    let best;
    for (let i = 1; i < ALIGNMENT.length; i++) {
      const a = ALIGNMENT[i-1], b = ALIGNMENT[i], len = b.s-a.s, tx = (b.x-a.x)/len, tz = (b.z-a.z)/len;
      if (!len) continue;
      const raw = (x-a.x)*tx+(z-a.z)*tz, along = Math.max(0, Math.min(len, raw));
      const ex=x-a.x-tx*along, ez=z-a.z-tz*along, distance=Math.hypot(ex,ez);
      if (!best || distance < best.distance) best = { s:a.s+along, lateral:-tz*ex+tx*ez, tx,tz,distance,
        beyond:(i===1 && raw < -0.001)||(i===ALIGNMENT.length-1 && raw>len+0.001) };
    }
    return best;
  }
  const stationAt = (ll) => { const p=bridgeLocal(...ll); return projectBridge(p.x,p.z).s; };
  const landmarks = Object.fromEntries(Object.entries(spec.stations || {}).map(([k,ll]) => [k, stationAt(ll)]));
  const knots = spec.profile({ length: BRIDGE_LENGTH, deck: spec.deck, ...landmarks });
  const groundControls = spec.groundControls?.({ length: BRIDGE_LENGTH, ...landmarks });
  const smooth = t => t*t*(3-2*t);
  function deckHeight(s, approaches=spec.defaultApproaches || [0,0]) {
    s=Math.max(0, Math.min(BRIDGE_LENGTH,s));
    let i=1; while(i<knots.length-1 && knots[i][0]<s) i++;
    const a=knots[i-1],b=knots[i],t=smooth((s-a[0])/(b[0]-a[0]));
    const height = k => k[1] === 'start' ? approaches[0] : k[1] === 'end' ? approaches[1]
      : k[1] === 'road' ? (approaches[0]+approaches[1])/2 : k[1];
    return height(a)+(height(b)-height(a))*t;
  }
  function bridgePoint(station,lateral=0,height=null) {
    const s=Math.max(0,Math.min(BRIDGE_LENGTH,station)); let i=1;
    while(i<ALIGNMENT.length-1 && ALIGNMENT[i].s<s) i++;
    const a=ALIGNMENT[i-1],b=ALIGNMENT[i],len=b.s-a.s,t=(s-a.s)/len,tx=(b.x-a.x)/len,tz=(b.z-a.z)/len;
    return {x:a.x+(b.x-a.x)*t-tz*lateral,y:height??deckHeight(s),z:a.z+(b.z-a.z)*t+tx*lateral,tx,tz};
  }
  const cache=new WeakMap();
  function roadEdges(s,joins,sections) {
    let sides=sections && cache.get(sections);
    if(sections && !sides) {
      // An incomplete tile or polygon sliver cannot shrink a carriageway to
      // a fraction of its width. Fit from complete neighbouring samples.
      sides=ROAD_EDGES.map((_,i)=>sections.filter(v=>{const [a,b]=authoredEdges(v.s)[i];return v.edges[i] && v.edges[i][1]-v.edges[i][0]>=Math.max(2,(b-a)*0.6);}));
      cache.set(sections,sides);
    }
    return authoredEdges(s).map((edges,side)=>{
      const list=sides?.[side];
      if(list?.length) {
        let lo=0,hi=list.length;while(lo<hi){const m=(lo+hi)>>>1;if(list[m].s<s)lo=m+1;else hi=m;}
        const a=list[Math.max(0,lo-1)],b=list[Math.min(list.length-1,lo)],t=a.s===b.s?0:(s-a.s)/(b.s-a.s);
        return a.edges[side].map((v,i)=>v+(b.edges[side][i]-v)*t);
      }
      const end=s<BRIDGE_LENGTH/2?0:1,t=1-smooth(Math.min(1,(end?BRIDGE_LENGTH-s:s)/200));
      return edges.map((v,i)=>v+((joins?.[end]?.[side]?.[i]??v)-v)*t);
    });
  }
  function fittedLateral(s,d,joins,sections) {
    // Pedestrian-only landmarks have no vehicle pavement to fit.
    if (!ROAD_EDGES.length) return d;
    if(railGap && Math.abs(d)<railGap) return d;
    const side=ROAD_EDGES.length===1?0:d<0?0:1,old=authoredEdges(s)[side],next=roadEdges(s,joins,sections)[side];
    if(d<old[0])return d+next[0]-old[0];if(d>old[1])return d+next[1]-old[1];
    return next[0]+(d-old[0])/(old[1]-old[0])*(next[1]-next[0]);
  }
  function bridgeRoadHeight(lng,lat,heading,approaches,joins,sections) {
    const p=bridgeLocal(lng,lat);
    if(p.x<bounds.minX-10||p.x>bounds.maxX+10||p.z<bounds.minZ-10||p.z>bounds.maxZ+10)return null;
    const q=projectBridge(p.x,p.z);
    if(q.beyond || !roadEdges(q.s,joins,sections).some(([a,b])=>q.lateral>=a-0.6 && q.lateral<=b+0.6))return null;
    if(Number.isFinite(heading)){
      const h=heading*Math.PI/180,along=Math.sin(h)*q.tx-Math.cos(h)*q.tz;
      if(Math.abs(along)<(spec.headingAlignment??0.8))return null;
      // Stacked decks (optional spec.deckOffset): each travel direction reads its own deck.
      if(spec.deckOffset)return deckHeight(q.s,approaches)+spec.deckOffset(q.s,Math.sign(along));
    }
    return deckHeight(q.s,approaches);
  }
  function resampleBridgeLine(line) {
    if(!line.coords.length)return line;
    const coords=[line.coords[0]],segmentMap=[];let changed=false;
    for(let i=1;i<line.coords.length;i++){
      const a=line.coords[i-1],b=line.coords[i],p=bridgeLocal(...a),q=bridgeLocal(...b);
      const overlaps=Math.max(p.x,q.x)>=bounds.minX-30&&Math.min(p.x,q.x)<=bounds.maxX+30&&Math.max(p.z,q.z)>=bounds.minZ-30&&Math.min(p.z,q.z)<=bounds.maxZ+30;
      const n=overlaps?Math.min(1024,Math.max(1,Math.ceil(Math.hypot(q.x-p.x,q.z-p.z)/5))):1;
      changed ||= n>1;
      for(let j=1;j<=n;j++){coords.push(j===n?b:[a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);segmentMap.push(line.segmentMap?.[i-1]??i-1);}
    }
    return changed?{...line,coords,segmentMap}:line;
  }
  /** Metres from the deck surface to the deck a vehicle travelling toward increasing (direction
   * +1) or decreasing (-1) station drives on: 0 unless the spec stacks its two directions. */
  const deckOffset=(s,direction)=>spec.deckOffset?spec.deckOffset(Math.max(0,Math.min(BRIDGE_LENGTH,s)),direction):0;
  return {surfaceStep:5,CHAMPLAIN,STRETCH,ALIGNMENT,BRIDGE_LENGTH,ROAD_EDGES,halfWidth,railGap,bounds,landmarks,knots,groundControls,
    bridgeLocal,bridgeLngLat,projectBridge,stationAt,bridgePoint,deckHeight,deckOffset,roadEdges,fittedLateral,bridgeRoadHeight,resampleBridgeLine};
}
