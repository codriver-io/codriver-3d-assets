import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './big-chicken-marietta-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const {prism,face,flush}=t,ring=[[17.18191884791704,8.108239544668052],[17.406235770338633,-12.088901046630813],[-3.435789992132463,-12.086838249194987],[-3.8837643842875806,-6.96329904306999],[-11.288611488441749,-6.899445575169911],[-10.88210255428412,-3.0415690855768514],[-15.96004769054523,-2.9871195616460495],[-15.897384472839143,6.99084933590287],[0.5472940518168921,7.574490368880047],[1.1170212889991022,8.87194725846309],[2.610155837180105,12.304784141554093],[4.3958275567252745,8.990253742432012],[5.071804673364786,7.7260192634087]];
 prism(ring,0,3.3,'stone',{floors:1,margin:.2,base:.3,bottom:false});prism(ring,3.3,4.1,'brick',{roof:'roof',bottom:false});
 const cx=4,z0=8.2,depth=.9,profile=[[-5,0],[3,0],[3,17.0688],[-1,17.0688],[-5,5]],panel=[[-4.2,5],[2.5,5],[2.4,13.1],[-2.1,12.4]],segments=near?24:16,eye=[1,15.2],circle=(r,x=eye[0],y=eye[1])=>Array.from({length:segments},(_,i)=>[x+r*Math.cos(i*2*Math.PI/segments),y+r*Math.sin(i*2*Math.PI/segments)]),outerEye=circle(1.05),whiteEye=circle(.90),pupil=circle(.30,1.12,15.40);
 function flat(shape,holes,mat,z,sign){const all=[...shape,...holes.flat()];for(const tri of THREE.ShapeUtils.triangulateShape(shape.map(p=>new THREE.Vector2(...p)),holes.map(h=>h.map(p=>new THREE.Vector2(...p)))))face(mat,tri.map(i=>[all[i][0]+cx,all[i][1],z]),[0,0,sign]);}
 for(const sign of[-1,1]){const z=z0+sign*depth;flat(profile,[panel,outerEye],'brick',z,sign);flat(panel,[],'stone',z,sign);flat(outerEye,[whiteEye],'dark',z,sign);flat(whiteEye,[pupil],'white',z,sign);flat(pupil,[],'dark',z,sign);}
 profile.forEach((a,i)=>{const c=profile[(i+1)%profile.length];if(a[1]===0&&c[1]===0)return;face('brick',[[cx+a[0],a[1],z0-depth],[cx+c[0],c[1],z0-depth],[cx+c[0],c[1],z0+depth],[cx+a[0],a[1],z0+depth]],[c[1]-a[1],a[0]-c[0],0]);});
 // Two rigid, separated beak plates contact the straight head edge at x=3.
 for(const tri of [[[3,15.3],[5.5,16.3],[3,16.0]],[[3,14.2],[5.5,14.4],[3,14.9]]]){for(const sign of[-1,1])flat(tri,[],'gold',z0+sign*.55,sign);tri.forEach((a,i)=>{const c=tri[(i+1)%tri.length];face('gold',[[cx+a[0],a[1],z0-.55],[cx+c[0],c[1],z0-.55],[cx+c[0],c[1],z0+.55],[cx+a[0],a[1],z0+.55]],[c[1]-a[1],a[0]-c[0],0]);});}
 return flush(-0.603883921190038);
}
