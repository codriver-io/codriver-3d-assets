// OSM west wall controls [-0.1455049,51.4824815], [-0.1455901,51.4822386].
// Architectural u runs across the halls; v south along them. Rotation baked once.
export const ANGLE=12.4*Math.PI/180;
const c=Math.cos(ANGLE),s=Math.sin(ANGLE);
export const point=(u,y,v)=>[c*u-s*v,y,s*u+c*v];
export const unpoint=(x,z)=>[c*x+s*z,-s*x+c*z];
// Orthogonalised OSM plan; rounding fit within 1.5 m of owned outlines.
export const VOLUMES=[
 {name:'west-switch-house',x0:-72.4,x1:-46.5,z0:-76,z1:36.5,h:30},
 {name:'west-turbine-hall',x0:-46.5,x1:-21.8,z0:-87.2,z1:57.6,h:30},
 {name:'boiler-house',x0:-21.8,x1:39.4,z0:-87.2,z1:58,h:49},
 {name:'east-turbine-hall',x0:39.4,x1:65.5,z0:-87,z1:46.3,h:30},
 {name:'east-south-switch-house',x0:43.3,x1:73.2,z0:46.3,z1:64.8,h:30},
 {name:'east-switch-house',x0:65.5,x1:85.2,z0:-81.8,z1:43.8,h:30},
 {name:'west-south-annex',x0:-58,x1:-46.5,z0:36.5,z1:41,h:19},
 {name:'east-north-annex',x0:62.8,x1:72,z0:-87.4,z1:-81.8,h:35},
];
export const TOWERS=[
 {name:'northwest',x0:-28.7,x1:-5.5,z0:-98.4,z1:-87.2,u:-17.1,v:-92.8},
 {name:'northeast',x0:20.6,x1:49.6,z0:-98.8,z1:-87,u:35.2,v:-93},
 {name:'southwest',x0:-29.6,x1:-6,z0:58,z1:69.2,u:-17.8,v:63.6},
 {name:'southeast',x0:19.6,x1:42.8,z0:58,z1:69.8,u:31.2,v:64},
];
export function buildingVolumes(){return [...VOLUMES,...TOWERS.flatMap(t=>[
 {...t,name:t.name+'-wash-tower',h:44},
 {...t,x0:t.x0+1.1,x1:t.x1-1.1,z0:t.z0+.45,z1:t.z1-.45,h:47.5},
 {name:t.name+'-plinth',x0:t.u-6,x1:t.u+6,z0:t.v-4.65,z1:t.v+4.65,h:51},
])];}
