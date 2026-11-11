import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './olympiaturm-munich-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
 const profile=[[7.5,0],[6.1,20],[4.4,145],[4.3,150],[8.2,151],[12.8,154],[13.2,155],[13.2,156],[13,156],[13,160],[13.2,160],[13.2,161],[5.1,162],[5.1,164],[12.6,164],[12.6,165],[12.5,165],[12.5,169],[12.8,169],[12.8,170],[5.0,171],[5.0,173],[13,173],[13,174],[12.8,174],[12.8,176.5],[13,176.5],[13,177.5],[4.3,178],[13.5,181],[14.2,183],[14.2,186],[14.2,187],[14.2,190],[14.2,191],[14.2,193],[12.6,195],[4.1,195],[4.1,209],[4,214],[9,214],[9,215],[3.6,216],[3.3,239]];
 spin(profile,'stone',0,0,near?48:28,(k,j)=>{const y=(profile[k][1]+profile[k+1][1])/2,vertical=profile[k][0]===profile[k+1][0];if(y>=156&&y<160||y>=165&&y<169||y>=174&&y<176.5)return j%(near?12:7)===0?'metal':'grille';return y>=183&&y<193&&vertical?(j%(near?8:5)===0?'metal':'glass'):'stone';});
 const antenna=[];for(let y=239;y<=289;y+=5){const r=y<259?2.1-(y-239)*.025:1.55-(y-259)*.038;antenna.push([Math.max(.35,r),y]);}antenna.push([.25,291]);
 spin(antenna,'metal',0,0,near?16:10,k=>k%2?'beacon':'metal');
return finish();
}
