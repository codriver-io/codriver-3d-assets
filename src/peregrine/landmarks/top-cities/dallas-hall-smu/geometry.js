import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './dallas-hall-smu-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const {rect,ellipse,prism,loft,cyl,cap,face,flush}=t;
 const ring=[[8.844533637548592,-19.875181628282657],[8.83615423018354,-12.692360907638857],[11.972925294795166,-10.090768501196806],[11.96848118848505,-9.18865103467619],[35.0399692435096,-9.169193517106738],[35.03678726573374,-5.360661133515355],[38.339926227205495,-4.623106490464243],[40.66214979084804,-2.0447276706407616],[41.161591765721944,0.2361720706710393],[40.688423753110854,2.53140468394514],[38.398860632998385,5.130325044089217],[35.03251092661713,5.9088966035233375],[35.026439291672745,9.24980038495144],[11.646135667775974,9.227293671551678],[-12.927929376693434,8.991058750133202],[-24.48266324055713,8.970691442013269],[-35.46651205378592,8.957646614133424],[-35.46277163180726,5.527717350478556],[-39.38028759126232,4.193780856352687],[-41.225968120415125,1.2354413915784925],[-41.31521014721495,-1.1007430769945832],[-40.45551881090276,-3.2836031842327085],[-38.79592314252629,-4.9306187250959725],[-35.45147729038509,-5.831110687395975],[-35.44569705723266,-9.183142654295752],[-12.926104216501946,-9.160369068026535],[-10.465850892802806,-12.743710913837443],[-9.334012810367517,-12.751077504900827],[-9.324759198955164,-19.90051366909482]];
 prism(ring,0,2,'stone',{floors:1,margin:.23,bottom:false});prism(ring,2,15.6,'brick',{floors:3,margin:.24,trim:'stone'});
 // Low hipped roofs on the wings; the central rotunda remains independent.
 const lower=rect(81.9,18.2,-.2,0),upper=rect(73,2.2,-.2,0);loft([lower,upper],[15.6,17.3],'roof');
 prism(ellipse(12.5,12.5,near?40:24),0,19.9,'brick',{floors:4,margin:.28,trim:'stone',bottom:false,top:false});
 for(const[lo,hi,mat]of [[19.9,20.5,'stone'],[20.5,21,'brick'],[21,21.3,'stone']])prism(ellipse(12.5,12.5,near?40:24),lo,hi,mat,{top:false,bottom:false});
 const rings=[],ys=[],steps=near?10:6;for(let i=0;i<=steps;i++){const a=(Math.PI/2-.07)*i/steps;rings.push(ellipse(12.3*Math.cos(a),12.3*Math.cos(a),near?40:24));ys.push(21.3+6*Math.sin(a));}loft(rings,ys,'copper',{caps:false});cyl('glass',0,0,1.65,27.1,27.6);
 b.box('stone',[0,.8,13],[22,1.6,7.8]);
 // Six founded columns meet a continuous entablature; simplified Corinthian capitals retain their bulk.
 for(const x of[-8.5,-5.1,-1.7,1.7,5.1,8.5]){cyl('stone',x,14.3,.68,1.6,2.0);cyl('stone',x,14.3,.52,2,15.3,.43,near?12:8);cyl('stone',x,14.3,.75,15.3,16.3);}
 b.box('stone',[0,16.95,14],[22,1.3,4]);
 const outer=[[-11,17.6],[11,17.6],[0,21.3]],inner=[[-8.8,18.05],[8.8,18.05],[0,20.9]],z=16;
 for(let i=0;i<3;i++){const j=(i+1)%3;face('stone',[[...outer[i],z],[...outer[j],z],[...inner[j],z],[...inner[i],z]],[0,0,1]);face('stone',[[...outer[i],12],[...outer[j],12],[...outer[j],z],[...outer[i],z]],[i===0?0:outer[i][0],1,0]);}face('brick',inner.map(p=>[...p,z]),[0,0,1]);face('stone',outer.map(p=>[...p,12]),[0,0,-1]);
 for(let i=0;i<8;i++)b.box('stone',[0,.1*(i+1),22.1-i*.8],[20,.2*(i+1),.8]);
 return flush(-0.02617993877991494);
}
