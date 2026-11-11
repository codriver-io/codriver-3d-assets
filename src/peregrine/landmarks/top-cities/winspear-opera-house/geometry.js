import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './winspear-opera-house-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const {prism,ellipse,flush}=t;
 const lobby=[[-38.737908469518935,-0.9389045410608929],[-22.029792520611494,28.64700616516937],[12.940444234712357,29.171503397230275],[47.89545762883948,-31.339189090001476],[30.498242880420676,-61.51974044461845],[-4.095809847057911,-60.991103557570945]],columns=[[48.504852454271926,-77.97461341931081],[-55.964605230837066,-78.2291788694314],[-29.82577361426989,-77.88923008836004],[-4.051970187822294,-77.85920890878612],[22.31194526333045,-77.64839436404142],[48.40420083177137,-48.03363686758963],[48.24278213241072,-17.826759615987555],[47.77990021069006,12.519459123909495],[47.445103229272746,42.77729620489283],[21.36218221160789,42.64281676386884],[-4.617576988983857,42.52097674378511],[-30.613103496581033,43.162649173262174],[-56.78536689952506,42.71055347857171],[-56.35120314180173,12.426138970810158],[-56.0595266208568,-17.74887436784097],[-56.00736837488831,-47.856416986398294]];
 prism(lobby,0,18.288,'metal',{floors:4,bays:0,margin:.045,base:.25,roof:'dark'});
 const drum=ellipse(23,40,near?64:32).map(([x,z])=>[4.6+x*Math.cos(-Math.PI/6)+z*Math.sin(-Math.PI/6),-16-x*Math.sin(-Math.PI/6)+z*Math.cos(-Math.PI/6)]);
 prism(drum,0,32,'brick',{roof:'brick'});
 // Every perimeter column is founded at y=0 and meets the primary frame at 19.2 m.
 for(const[x,z]of columns)b.box('metal',[x,9.6,z],[1.15,19.2,1.15]);
 const x0=-61.8,x1=56.3,z0=-81.9,z1=59;
 // A closed perimeter ring and cross-girders support both ends of each open louver.
 b.box('roof',[(x0+x1)/2,19.6,z0],[x1-x0,.8,1]);b.box('roof',[(x0+x1)/2,19.6,z1],[x1-x0,.8,1]);
 b.box('roof',[x0,19.6,(z0+z1)/2],[1,.8,z1-z0]);b.box('roof',[x1,19.6,(z0+z1)/2],[1,.8,z1-z0]);
 for(const z of[-78.2,-48,-18,12.2,42.5])b.box('roof',[(x0+x1)/2,19.6,z],[x1-x0,.8,.8]);
 for(const x of[-56.2,-30.2,-4.1,22,48.3])b.box('metal',[x,19.05,(z0+z1)/2],[.65,.3,z1-z0]);
 const count=near?60:30,pitch=(x1-x0)/count;for(let i=1;i<count;i++)b.box('roof',[x0+i*pitch,19.8,(z0+z1)/2],[near?.55:1.1,.4,z1-z0]);
 return flush(Math.PI/4);
}
