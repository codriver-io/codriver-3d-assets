import polygonClipping from 'polygon-clipping';
import {parts} from './nhow-amsterdam-rai-parts.js';
export function create({detail='near'}={}){
 const p=parts(detail),{near,face,rect,ellipse,cap,facade,prism,block,loft,cylinder,dome,gable,skin,box,bar,put}=p;
const masses=[{"id":806837636,"ring":[[-11.502,-2.179],[-1.925,-8.702],[8.019,-9.425],[9.209,1.784],[4.87,11.236],[-6.074,5.58]],"lo":88,"hi":91},{"id":806837637,"ring":[[-31.104,-15.626],[27.274,-18.587],[3.829,34.212]],"lo":63,"hi":87.5},{"id":806837638,"ring":[[-33.614,1.784],[14.508,-30.02],[18.235,21.377],[18.772,28.746]],"lo":38.5,"hi":59.5},{"id":806837639,"ring":[[-31.104,-15.626],[27.274,-18.587],[3.829,34.212]],"lo":7,"hi":35}],tri=masses.filter(q=>q.id!==806837636);let common=polygonClipping.intersection(...tri.map(q=>[q.ring]))[0][0].slice(0,-1);const c=common.reduce((a,p)=>[a[0]+p[0]/common.length,a[1]+p[1]/common.length],[0,0]);common=common.map(([x,z])=>[c[0]+(x-c[0])*.86,c[1]+(z-c[1])*.86]);for(const[lo,hi]of [[0,7],[35,38.5],[59.5,63],[87.5,88]])prism('metal',common,lo,hi,{pitch:2.7,rows:Math.max(1,Math.round((hi-lo)/3.5)),fraction:.91,sill:.1,roof:'roof'});
 for(const q of masses)prism('metal',q.ring,q.lo,q.hi,{pitch:1.65,rows:Math.max(1,Math.round((q.hi-q.lo)/3.5)),fraction:.83,sill:.11,roof:'roof'});
 
 return p.finish();
}
