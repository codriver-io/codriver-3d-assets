import { Color, Float32BufferAttribute } from 'three';
import { ROAD_PALETTES } from '../../../basemap/road-material.js';
import { PROFILE, landingBlend } from './samuel-beckett-bridge-profile.js';

// Shader mix uses immutable station data rather than the refitted normals /
// colours which the shared terrain fitter updates after every DEM change.
export function applyLandingPavement(mesh,theme='light') {
  const g=mesh.geometry,mat=mesh.material;
  if(!g.attributes.samuelLandingMix) {
    const src=g.userData.champlainSource?.positions||g.attributes.position.array;
    const mix=Array.from({length:g.attributes.position.count},(_,i)=>landingBlend(PROFILE.projectBridge(src[i*3],src[i*3+2]).s));
    g.setAttribute('samuelLandingMix',new Float32BufferAttribute(mix,1));
  }
  const hex=(ROAD_PALETTES[theme]||ROAD_PALETTES.light).surfaceMajor;
  if(mat.userData.samuelLandingColor){mat.userData.samuelLandingColor.value.setHex(hex);return;}
  const uniform={value:new Color(hex)};mat.userData.samuelLandingColor=uniform;
  mat.onBeforeCompile=shader=>{
    shader.uniforms.samuelLandingColor=uniform;
    shader.vertexShader='attribute float samuelLandingMix;\nvarying float vSamuelLandingMix;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSamuelLandingMix = samuelLandingMix;');
    shader.fragmentShader='uniform vec3 samuelLandingColor;\nvarying float vSamuelLandingMix;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, samuelLandingColor, vSamuelLandingMix);');
  };
  mat.customProgramCacheKey=()=> 'samuel-beckett-landing-v1';
  mat.needsUpdate=true;
}
