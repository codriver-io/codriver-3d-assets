// Bayeux's exterior: west Romanesque stages, Gothic spires, chevet and copper lantern.
// u points along the nave toward the chevet; v is the south side of that axis.
export function buildCathedral(k){
 const west=-53.2,axis=-1.1;
 // Main nave and choir: high narrow walls over broad low chapels.
 k.box('stone',-25,0,axis,41,25,15.2);k.roof(-45.5,-4.5,-8.7,6.5,25,34);
 k.box('stone',20,0,-.3,25,25,13.6);k.roof(7.5,32.5,-7.1,6.5,25,34);
 for(const side of [-1,1]){
  const v=side===1?11.35:-13.0;
  k.box('stone',-24.9,0,v,40.6,12.3,9.0);
  k.roof(-45.2,-4.6,v-4.5,v+4.5,12.3,17.1);
  const cv=side===1?10.35:-9.85;
  k.box('stone',20.5,0,cv,25,12.3,8.4);k.roof(8,33,cv-4.2,cv+4.2,12.3,16.5);
 }
 // Transept: 37.6 m across, deliberately narrower than the annex to its north.
 k.box('stone',1.25,0,0,13.5,25,37.0);
 // roof ridge across v, assembled by rotating a local u-aligned prism kit manually below
 // Two steep gables on the transept ends and a roof loft crossing the nave.
 k.poly('roof',[[-6.75,0],[6.75,0],[0,9]],1.25,25,-18.5,0,37);
 for(const side of [-1,1]){
  const v=side*18.58,a=side===1?0:Math.PI;
  k.window(8.0,15,1.25,7.6,v,a,{lit:true});
  k.frame(9.0,16.0,.28,1.25,7.1,v+side*.28,a);
  k.poly('stone',[[-6.75,0],[6.75,0],[0,9]],1.25,25,v,a,.26);
  k.disc('glass',1.1,1.25,28,v+side*.35,a);k.ring('trim',1.1,1.38,1.25,28,v+side*.43,a);
  k.window(3.6,6,1.25,.2,v+side*.17,a,{rich:false});
  for(const u of [-4.7,7.2]){k.box('trim',u,0,side*18.1,1.0,27,1.1);k.pinnacle(u,side*18.1,27,9,.65);}
 }
 // Polygonal chevet and lower ambulatory, longitudinal centre at u=32.
 // Half of a decagon is retained; the hidden western half sits inside the choir.
 k.loft('stone',28,-.3,[[0,14.5],[12.2,14.5]],10,-Math.PI/10);
 // Separate shallow chapel roofs replace the single ambulatory cone.
 k.loft('stone',32,-.3,[[12.1,7.8],[25,7.8]],10,-Math.PI/10);
 k.loft('roof',32,-.3,[[25.04,7.9],[34,0.04]],10,-Math.PI/10);
 for(let i=0;i<5;i++){
  const a=(i-2)*Math.PI/5,normal=[Math.cos(a),Math.sin(a)],face=Math.PI/2-a;
  const u=28+13.91*normal[0],v=-.3+13.91*normal[1];
  k.window(4.3,8.0,u,.95,v,face);
  k.window(3.6,9,32+7.47*normal[0],14.6,-.3+7.47*normal[1],face,{lit:true});
  const outer=[28+14.25*normal[0],0,-.3+14.25*normal[1]];
  k.box('trim',outer[0],0,outer[2],1.15,12.0,1.15);
  k.box('stone',outer[0],11.82,outer[2],.86,10.6,.86);
  k.box('trim',outer[0],22.30,outer[2],1.05,.4,1.05);
  k.pinnacle(outer[0],outer[2],22.7,8.5,.62);
  k.chapelRoof(28,-.3,a,8.0,13.88,8.35,12.3,16.85);
  // A little gabled niche on each tall buttress pier.
  k.window(.45,4.0,outer[0]+normal[0]*.56,17.0,outer[2]+normal[1]*.56,face,{rich:false});
  const top=[32+7.7*normal[0],24,-.3+7.7*normal[1]],end=[outer[0],22.3,outer[2]];
  flying(top,end,.70);
  // The balustrade follows each mapped decagonal facade, below the distinct roof gables.
  for(const [y,R,count] of [[12.52,13.80,k.near?8:3],[25.0,7.56,k.near?5:2]]){
   const U=y<20?28:32,span=y<20?7.4:3.7;
   for(let j=0;j<count;j++){
    const off=(j-(count-1)/2)*span/count;
    k.frame(y<20?.79:.64,1.03,.11,U+R*normal[0]+Math.cos(face)*off,y,-.3+R*normal[1]-Math.sin(face)*off,face,true,false);
   }
  }
 }
 // String courses support the two ring galleries; they are offset from wall/roof planes.
 for(const [U,y,r] of [[28,12.00,14.58],[28,13.62,14.54],[32,24.77,7.90],[32,26.15,7.94]])k.loft('trim',U,-.3,[[y,r],[y+.28,r]],10,-Math.PI/10);
 for(const a of [-Math.PI*.3,-Math.PI*.1,Math.PI*.1,Math.PI*.3]){
  const u=32+7.65*Math.cos(a),v=-.3+7.65*Math.sin(a);
  k.loft('stone',u,v,[[25.1,.56],[29.2,.56]],k.near?8:6);
  k.pinnacle(u,v,29.2,7.5,.72);
 }
 k.box('stone',43.6,0,.15,6.8,12.2,6.6);k.roof(40.2,47.0,-3.15,3.45,12.25,16.5);
 k.window(3.5,8,47.09,1.5,.15,Math.PI/2);
 // Nave/choir bays, lower chapel gables and tall clerestory windows.
 for(const side of [-1,1]){
  const a=side===1?0:Math.PI,outer=side===1?15.95:-17.55,inner=side===1?6.58:-8.78;
  for(const u of [-41.8,-35.8,-29.8,-23.8,-17.8,-11.8]){
   k.window(4.1,8.4,u,1.5,outer,a);
   k.window(4.25,9.3,u,15.2,inner,a,{lit:true});
   k.poly('stone',[[-2.8,0],[2.8,0],[0,5.8]],u,11.3,outer+side*.15,a,.22);
   k.frame(3.3,4.6,.22,u,11.5,outer+side*.44,a);
   k.disc('glass',.62,u,15.4,outer+side*.48,a);k.ring('trim',.62,.81,u,15.4,outer+side*.57,a);
  }
  for(const u of [-44.8,-38.8,-32.8,-26.8,-20.8,-14.8,-8.8]){
   k.box('trim',u,0,outer-side*.28,.65,19,1.1);
   k.box('trim',u,18.8,outer-side*.28,.83,.5,1.3);k.pinnacle(u,outer-side*.28,19.3,5.7);
   flying([u,24.8,inner],[u,19.0,outer-side*.4],.43);
   k.box('trim',u,17,inner-side*.15,.45,9.0,.55);
   if(k.near)k.pinnacle(u,inner-side*.15,26,2.2,.22);
  }
  for(const u of [11.5,17.5,23.5,29.5]){
   const ov=side===1?14.65:-14.15,iv=side===1?6.58:-7.18;
   k.window(4.1,8.2,u,1.7,ov,a);k.window(4.0,9.2,u,15.0,iv,a,{lit:true});
   k.box('trim',u-2.8,0,ov-side*.25,.7,18.8,1);k.pinnacle(u-2.8,ov-side*.25,18.8,6);
   flying([u-2.8,24.5,iv],[u-2.8,18.3,ov-side*.3],.42);
  }
  // The tiny arcaded stone eaves gallery is visible in the side reference.
  k.box('trim',-25.0,24.45,inner,40.3,.38,.48);
  if(k.near)for(let u=-44;u<-5;u+=1.02)k.frame(.79,1.1,.12,u,23.1,inner+side*.13,a,true);
 }
 // The two west towers: square Romanesque masonry stages, stone octagonal spires.
 for(const v of [-13.15,10.9]){
  const u=-49.5;
  k.box('stone',u,0,v,7.4,47.0,7.2);
  for(const y of [15.7,29.2,38.5,46.8])k.box('trim',u,y,v,7.66,.55,7.46);
  for(const du of [-3.28,3.28])for(const dv of [-3.14,3.14])k.box('trim',u+du,0,v+dv,.45,46.8,.45);
  for(const face of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
   const n=[Math.sin(face),Math.cos(face)],t=[Math.cos(face),-Math.sin(face)];
   for(const [y,h,w,count] of [[18.0,9.2,.95,2],[31.1,5.5,.95,2],[40.2,4.9,.85,3]])for(let j=0;j<count;j++){
    const d=(j-(count-1)/2)*(count===3?1.9:2.5);
    k.window(w,h,u+n[0]*3.79+t[0]*d,y,v+n[1]*3.69+t[1]*d,face,{round:true,rich:false});
   }
   if(k.near)for(let j=-2;j<=2;j++)k.frame(1.1,1.75,.15,u+n[0]*3.85+t[0]*j*1.35,13.0,v+n[1]*3.76+t[1]*j*1.35,face,true);
  }
  k.loft('stone',u,v,[[47.0,4.0],[50.0,3.7],[76.0,.025]],8,Math.PI/8);
  // Corner spirelets rise from the tower ledge; roofs and ribs keep them attached.
  for(const du of [-2.65,2.65])for(const dv of [-2.65,2.65]){
   k.box('trim',u+du,46.92,v+dv,.7,3.08,.7);k.pinnacle(u+du,v+dv,50,8,.53);
  }
  if(k.near)for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;k.bar('trim',[u+3.72*Math.cos(a),50,v+3.72*Math.sin(a)],[u,76,v],.1);}
  // The large gabled lucarnes are part of the spire silhouette, not paint.
  for(let i=0;i<(k.near?4:2);i++){
   const a=i*Math.PI/(k.near?2:1),n=[Math.cos(a),Math.sin(a)],f=Math.PI/2-a;
   k.poly('stone',[[-1.05,0],[1.05,0],[1.05,4.2],[0,6.5],[-1.05,4.2]],u+n[0]*2.62,51,v+n[1]*2.62,f,.90);
   k.window(1.05,4.6,u+n[0]*3.60,51.55,v+n[1]*3.60,f,{rich:false});
   k.poly('trim',[[-1.18,0],[0,2.3],[1.18,0],[.96,0],[0,1.8],[-.96,0]],u+n[0]*3.73,55.15,v+n[1]*3.73,f);
  }
  if(k.near)for(let i=0;i<4;i++)for(const y of [59,63,67]){
   const a=i*Math.PI/2,r=3.7*(76-y)/26;
   k.loft('trim',u+r*Math.cos(a),v+r*Math.sin(a),[[y-.18,.15],[y+.2,.12]],4,0);
  }

  k.box('trim',u,75.8,v,.1,.8,.1);k.box('trim',u,76.12,v,.55,.08,.1);
  // Slender flanking stair turrets, tucked within the outline.
  k.loft('stone',-45.5,v+(v>0?4.6:-4.6),[[0,1],[32,1]],k.near?8:6);
  k.pinnacle(-45.5,v+(v>0?4.6:-4.6),32,6,1.05);
 }
 // West screen: five broad portals, a small tympanum rose and the Gothic gallery.
 k.box('stone',-49.5,0,axis,7.4,29.4,16.8);
 k.poly('stone',[[-8.4,0],[8.4,0],[0,10.8]],west,29.4,axis,-Math.PI/2,.38);
 // Retain the real pointed opening, but reduce the old dark trefoil field by almost half.
 k.window(9.4,10.2,west-.13,18,axis,-Math.PI/2,{lit:true,rich:false});
 k.frame(10.3,11.0,.35,west-.36,17.8,axis,-Math.PI/2);
 // Lancets and four-leaf rosettes follow the hierarchy of ref 2.
 const face=-Math.PI/2;
 for(const off of [-3.3,-1.1,1.1,3.3]){
  k.frame(1.9,5.6,.18,west-.52,18.1,axis+off,face,false,false);
  k.box('trim',west-.54,18,axis+off,.12,3.8,.10);
 }
 k.box('trim',west-.52,18.0,axis,.16,10,.13);
 for(const [off,y,r] of [[-2.6,24.5,1.02],[2.6,24.5,1.02],[0,26.4,1.22]]){
  k.ring('trim',r,r+.15,west-.54,y,axis+off,face);
  if(k.near)for(let j=0;j<4;j++){const a=j*Math.PI/2;k.ring('trim',r*.25,r*.34,west-.57,y+Math.sin(a)*r*.42,axis+off+Math.cos(a)*r*.42,face);}
  k.bar('trim',[west-.6,y-r,axis+off],[west-.6,y+r,axis+off],.1);
  k.bar('trim',[west-.6,y,axis+off-r],[west-.6,y,axis+off+r],.1);
 }
 // Gallery below the traceried window: circular balustrade above a moulded sill.
 k.box('trim',west-.46,17.4,axis,.55,.45,10.7);
 for(let j=-4;j<=4;j++)k.ring('trim',.43,.55,west-.79,16.95,axis+j*1.08,face);
 k.box('trim',west-.51,16.25,axis,.43,.18,10.7);
 for(const [v,w,h,gable] of [[axis,7.0,13.8,4.0],[axis-6.7,4.8,11.5,7.0],[axis+6.7,4.8,11.5,7.0],[-15.2,2.4,8.3,4.8],[13.5,2.4,8.3,4.8]]){
  k.poly('recess',[[-w/2,0],[w/2,0],[w/2,h-w*.87],[0,h],[-w/2,h-w*.87]],west-.25,.02,v,face);
  for(let j=0;j<(k.near?4:2);j++)k.frame(w+j*.38,h+j*.3,.17,west-.37-j*.11,.02,v,face);
  // Openwork gabled canopies over each portal; frames surround separate small roses.
  k.poly('stone',[[-w*.61,0],[w*.61,0],[0,gable]],west-.4,h+.45,v,face,.19);
  const cy=h+gable*.42;
  k.disc('recess',w*.17,west-.65,cy,v,face);k.ring('trim',w*.17,w*.21,west-.76,cy,v,face);
  for(const sign of [-1,1])k.bar('trim',[west-.66,h+.45,v+sign*w*.61],[west-.66,h+.45+gable,v],.15);
  if(k.near)for(let j=1;j<4;j++){const t=j/4;for(const sign of [-1,1])k.pinnacle(west-.45,v+sign*w*.61*(1-t),h+.45+gable*t,.8,.10);}
 }
 // Central tympanum contains a small rose, rather than the old huge trefoil window.
 k.disc('glass',1.8,west-.67,8.9,axis,face);k.ring('trim',1.8,2.12,west-.78,8.9,axis,face);
 for(let j=0;j<(k.near?12:8);j++){const a=j*2*Math.PI/(k.near?12:8);k.bar('trim',[west-.85,8.9+Math.sin(a)*.3,axis+Math.cos(a)*.3],[west-.85,8.9+Math.sin(a)*1.75,axis+Math.cos(a)*1.75],.1);}
 k.box('trim',west-.45,0,axis,.38,5,.35);
 k.disc('glass',1.45,west-.43,36.3,axis,face);k.ring('trim',1.45,1.73,west-.53,36.3,axis,face);
 // Upper Gothic screen: five tall open gallery niches, pointed canopies and crockets.
 k.box('trim',west-.48,29.25,axis,.55,.35,16.5);
 for(let j=-2;j<=2;j++){
  const v=axis+j*2.95;
  k.window(1.9,3.8,west-.19,29.65,v,face,{rich:false});
  k.poly('trim',[[-1.48,0],[0,3.3],[1.48,0],[1.18,0],[0,2.65],[-1.18,0]],west-.52,33.1,v,face);
  k.disc('recess',.40,west-.44,34.1,v,face);k.ring('trim',.40,.54,west-.62,34.1,v,face);
  k.pinnacle(west-.10,v,35.85,1.3,.15);
 }
 if(k.near)for(const v of [axis-8.0,axis-4.0,axis+4.0,axis+8.0]){
  k.box('trim',west-.38,10,v,.52,3.0,.45);k.pinnacle(west-.38,v,13,1.3,.38);
 }
 // Central lantern: tall octagonal Gothic stages, ribbed copper bulb and open finial.
 const cu=.3,cv=-.4;
 k.box('stone',cu,24.85,cv,12,12.15,12);
 k.loft('stone',cu,cv,[[37,6.2],[52,6.2],[52.5,5.45],[62.8,5.45]],8,-Math.PI/8);
 for(const [y,r] of [[37.08,6.35],[51.8,6.35],[53,5.6],[62.28,5.65]])k.loft('trim',cu,cv,[[y,r],[y+.5,r]],8,-Math.PI/8);
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,n=[Math.cos(a),Math.sin(a)],f=Math.PI/2-a;
  k.window(3.0,10.7,cu+5.82*n[0],39.5,cv+5.82*n[1],f,{round:false,rich:true});
  for(const off of [-.91,.91])k.window(1.25,8.0,cu+5.12*n[0]+Math.cos(f)*off,54,cv+5.12*n[1]-Math.sin(f)*off,f,{rich:false});
  const e=a+Math.PI/8;
  k.bar('trim',[cu+5.95*Math.cos(e),52,cv+5.95*Math.sin(e)],[cu+5.35*Math.cos(e),62.8,cv+5.35*Math.sin(e)],.32);
  k.pinnacle(cu+5.95*Math.cos(e),cv+5.95*Math.sin(e),52,6,.36);
  k.loft('trim',cu+5.35*Math.cos(e),cv+5.35*Math.sin(e),[[61.0,.33],[62.88,.33]],6,0);
  k.pinnacle(cu+5.35*Math.cos(e),cv+5.35*Math.sin(e),62.88,5.4,.38);
 }
 k.disc('recess',1.0,cu-6.02,47.0,cv,-Math.PI/2);k.ring('trim',1,1.18,cu-6.11,47,cv,-Math.PI/2);
 // Copper ogee crown: a swelling shoulder, concave neck and tall finial (ref 1).
 const crown=[[62.95,3.10],[63.8,3.40],[65.2,3.50],[66.7,3.25],[68.2,2.65],[69.5,1.35],[70.2,.82]];
 k.loft('copper',cu,cv,crown,k.near?24:12,0);
 for(let i=0;i<(k.near?12:8);i++){
  const a=i*2*Math.PI/(k.near?12:8),p=(r,y)=>[cu+r*Math.cos(a),y,cv+r*Math.sin(a)];
  for(let j=1;j<crown.length;j++)k.bar('trim',p(crown[j-1][1]+.035,crown[j-1][0]),p(crown[j][1]+.035,crown[j][0]),k.near?.075:.055);
 }
 k.loft('copper',cu,cv,[[70.2,.82],[70.55,.68],[71.0,.68],[73.8,.03]],8,0);
 k.box('trim',cu,73.6,cv,.10,.9,.10);k.box('trim',cu,74.05,cv,.55,.08,.1);
 // Mapped north additions: subdued attached halls, no imported neighbouring building.
 for(const [u,v,w,d,h,r] of [[-7.2,-28.3,17.6,13,9.5,15],[-45.7,-24.2,8.4,13.0,9,13.5]]){
  k.box('stone',u,0,v,w,h,d);k.roof(u-w/2,u+w/2,v-d/2,v+d/2,h,r);
  for(let q=u-w/2+2.1;q<u+w/2;q+=3.9)k.window(1.9,5.0,q,1.4,v-d/2-.09,Math.PI,{rich:false});
 }
 k.box('stone',0,0,-20.3,2.9,9.5,4.6);k.roof(-1.45,1.45,-22.6,-18,9.55,12.0);
 function flying(a,b,width){
  // Closed extruded masonry arch with a curved soffit, rather than thin segmented bars.
  k.flyer(a,b,Math.max(.62,width));
 }
}
