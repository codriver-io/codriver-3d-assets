import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createParisPalace } from './paris-palaces-geometry.js';
import { createParisHistoric } from './paris-historic-geometry.js';
import { createParisIcon } from './paris-icons-geometry.js';
import { PARIS_BRIDGES, createParisBridge, metricFrame, parisBridgeSpans } from './paris-bridges-geometry.js';
import { disposeChamplain } from './champlain-geometry.js';

function localRay(model,origin,direction){
  model.updateMatrixWorld(true);
  const p=new THREE.Vector3(...origin).applyMatrix4(model.matrixWorld);
  const d=new THREE.Vector3(...direction).transformDirection(model.matrixWorld);
  return new THREE.Raycaster(p,d).intersectObject(model,true);
}

test('Eiffel ground passage and Notre-Dame belfry openings remain physically open in both LODs',()=>{
  for(const detail of ['near','far']){
    const eiffel=createParisIcon('paris-tour-eiffel',{detail});
    assert.equal(localRay(eiffel,[0,15,150],[0,0,-1]).length,0,'ground passage');
    disposeChamplain(eiffel);
    const cathedral=createParisIcon('paris-notre-dame',{detail});
    const holes=localRay(cathedral,[18.1,52,100],[0,0,-1]);
    assert.equal(holes.length,0,'belfry transmits the sky');
    assert.ok(localRay(cathedral,[0,55,100],[0,0,-1]).length,'spire has no floating gap above crossing');
    disposeChamplain(cathedral);
  }
});

test('masonry span counts are independent of intermediate map nodes; Bir-Hakeim has two three-span arms',()=>{
  const counts={'bir-hakeim':6,neuf:12,iena:5,concorde:5};
  for(const spec of PARIS_BRIDGES.filter(s=>s.style!=='alexandre')){
    const frame=metricFrame(spec),spans=parisBridgeSpans(spec,frame);
    assert.equal(spans.length,counts[spec.style]);
    assert.ok(spans.every(([a,b])=>b>a&&a>=0&&b<=frame.length+.001));
    if(['iena','concorde'].includes(spec.style)){
      const widths=spans.map(([a,b])=>b-a);
      assert.ok(Math.max(...widths)-Math.min(...widths)<.001,'five comparable spans');
    }
  }
});

test('Bir-Hakeim central supports do not intrude into either road corridor',()=>{
  const spec=PARIS_BRIDGES.find(s=>s.style==='bir-hakeim'),f=metricFrame(spec);
  for(const detail of ['near','far']){
    const model=createParisBridge(spec,{detail});model.updateMatrixWorld(true);
    for(let s=14;s<f.length-14;s+=6)for(const d of [-4.6,4.6]){
      const ray=new THREE.Raycaster(new THREE.Vector3(...f.point(s,d,f.height(s)+7)),new THREE.Vector3(0,-1,0),0,6.7);
      assert.equal(ray.intersectObject(model,true).length,0,`${detail} lane at ${s}m`);
    }
    disposeChamplain(model);
  }
});

test('stone vaults have a visible downward-facing soffit across their full width',()=>{
  const spec=PARIS_BRIDGES.find(s=>s.style==='iena'),f=metricFrame(spec);
  const [a,b]=parisBridgeSpans(spec,f)[2],s=(a+b)/2;
  for(const detail of ['near','far']){
    const model=createParisBridge(spec,{detail});model.updateMatrixWorld(true);
    for(const d of [-10,0,10]){
      const ray=new THREE.Raycaster(new THREE.Vector3(...f.point(s,d,0)),new THREE.Vector3(0,1,0));
      const hits=ray.intersectObject(model,true).filter(h=>h.object.material.name==='stone');
      assert.ok(hits.length,'vault exists below central roadway');
      assert.ok(hits[0].face.normal.y<-.5,'soffit normal faces the river');
    }
    disposeChamplain(model);
  }
});


test('Louvre pyramid has a 21 m apex, transparent glazing and open surrounding courts in both LODs',()=>{
  for(const detail of ['near','far']){
    const model=createParisPalace('paris-louvre',{detail});
    const hits=localRay(model,[170,50,0],[0,-1,0]);
    assert.ok(Math.abs(hits[0].point.y-21)<.01,'pyramid apex');
    for(const p of [[0,50,0],[170,50,35],[400,50,0]])assert.equal(localRay(model,p,[0,-1,0]).length,0,'open courtyard');
    const pane=model.children.find(o=>o.material?.name==='glazing');
    assert.ok(pane.material.transparent&&pane.material.opacity<.5);
    disposeChamplain(model);
  }
});

test('Grand Palais has closed rounded roof ends and a glazed transverse vault in both LODs',()=>{
  for(const detail of ['near','far']){
    const model=createParisPalace('paris-grand-palais',{detail});
    for(const p of [[0,60,83],[0,60,-83],[52,60,0],[-52,60,0]]){
      const hit=localRay(model,p,[0,-1,0]).find(h=>h.object.material.name==='glass');
      assert.ok(hit&&hit.point.y>33,'continuous glass roof');
      assert.ok(hit.face.normal.y>0,'roof faces sky');
    }
    disposeChamplain(model);
  }
});

test('Hotel de Ville campanile remains open at both arcade levels in both LODs',()=>{
  for(const detail of ['near','far']){
    const model=createParisHistoric('paris-hotel-de-ville',{detail});
    for(const y of [38,44.5])assert.equal(localRay(model,[0,y,-100],[0,0,1]).length,0,'belfry sky opening');
    disposeChamplain(model);
  }
});
