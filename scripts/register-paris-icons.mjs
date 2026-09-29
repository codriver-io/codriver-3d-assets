import { readFile, writeFile } from 'node:fs/promises';
import { PARIS_ICONS } from '../src/peregrine/landmarks/paris-icons-geometry.js';

const details={
  'paris-tour-eiffel':{
    description:'Open four-legged iron lattice tower with swept arches, three decks and antenna.',
    notes:'Permanent daytime structure. Published 330 m height, 125 m base, floor heights 57/115/276 m; lattice and antenna subdivisions estimated. OSM way 5013364 anchors the four-footing square.',
    references:[['Official Eiffel Tower figures','https://www.toureiffel.paris/fr/le-monument/chiffres-cle'],['OSM footprint way 5013364','https://www.openstreetmap.org/way/5013364']]
  },
  'paris-arc-de-triomphe':{
    description:'Stone triumphal arch with main and transverse open passages, attic and relief masses.',
    notes:'Published 50 × 44.8 × 22.2 m exterior; official large portal about 29 × 14 m. Reliefs estimated. OSM way 226413508 fixes the orientation; road circulation is outside this model.',
    references:[['City of Paris dimensions','https://www.paris.fr/pages/a-la-place-de-l-arc-de-triomphe-devait-troner-un-elephant-18396'],['CMN arch opening','https://www.paris-arc-de-triomphe.fr/en/content/download/9830003/file/Sales%20Guide%202025_compressed.pdf?inLanguage=eng-GB&version=45'],['OSM footprint way 226413508','https://www.openstreetmap.org/way/226413508']]
  },
  'paris-notre-dame':{
    description:'Restored Gothic cathedral exterior with paired west towers, nave, transept, flying buttresses and spire.',
    notes:'Published 127 m length, 48 m width, 69 m towers, 96 m spire. Buttress rhythm, portals and roofs estimated; no scaffolding.',
    references:[['Cathedral plan and dimensions','https://www.notredamedeparis.fr/en/understand/architecture/plans/'],['Cathedral spire','https://www.notredamedeparis.fr/en/understand/architecture/the-spire/'],['OSM footprint way 201611261','https://www.openstreetmap.org/way/201611261']]
  },
  'paris-sacre-coeur':{
    description:'White Romano-Byzantine basilica with clustered domes, campanile, front portico and separate pedestrian steps.',
    notes:'Official campanile height 84 m; dome/terrace details visually estimated. OSM way 23762981 bounds the building, not the separate pedestrian terraces.',
    references:[['Basilica facade and campanile','https://www.sacre-coeur-montmartre.com/decouvrir/patrimoine-et-art-sacre/lentree-et-sa-facade/'],['OSM footprint way 23762981','https://www.openstreetmap.org/way/23762981']]
  },
  'paris-invalides':{
    description:'Gilded dome church with colonnaded drum, lantern, front portico and bounded wings.',
    notes:'Current museum brochure gives 107 m dome height; OSM church way 112452790 constrains the ~58 × 70 m church scope. Drum details visually estimated; hospital complex excluded.',
    references:[['Musée de l’Armée current dome facts','https://www.musee-armee.fr/fileadmin/cru-1761668226/user_upload/Documents/Communiques_Presse/MA_brochure_MINERVE_EN_A4_mail_v2.pdf'],['OSM church way 112452790','https://www.openstreetmap.org/way/112452790']]
  }
};
const path=new URL('../prototypes/assets3d/catalog.json',import.meta.url),catalog=JSON.parse(await readFile(path,'utf8'));
for(const spec of PARIS_ICONS){
  const existingIndex=catalog.assets.findIndex(e=>e.id===spec.id);
  const d=details[spec.id],sourcePath='src/peregrine/landmarks/paris-icons-geometry.js';
  const entry={
    id:spec.id,name:spec.name,kind:'building',location:'Paris, France',status:'ready',
    description:d.description,manifest:`/models/buildings/${spec.id}.json`,
    source:{path:sourcePath,build:'pnpm build:paris-icons',
      provenance:'Original texture-free procedural geometry commissioned in 2026 for Codriver. Geographic orientation and placement are approximate; no simulator or third-party meshes/textures used. Geographic reference © OpenStreetMap contributors (ODbL 1.0).',
      references:d.references.map(([label,url])=>({label,url})),
      url:`https://github.com/codriver-io/codriver-3d-assets/blob/main/${sourcePath}`},
    inspection:{url:`/asset-preview.html?asset=${spec.id}`,views:[
      {label:'Overview',url:`/asset-preview.html?asset=${spec.id}&view=overview`},
      {label:'Facade',url:`/asset-preview.html?asset=${spec.id}&view=facade`},
      {label:'Roof',url:`/asset-preview.html?asset=${spec.id}&view=roof`},
      {label:'Far',url:`/asset-preview.html?asset=${spec.id}&detail=far`}]},
    notes:d.notes,documentation:`docs/assets/${spec.id}.md`,
    license:'CC-BY-4.0',codeLicense:'MIT',
    attribution:'Codriver; geographic placement © OpenStreetMap contributors',
    copyright:'© 2026 Codriver (original commissioned model)',
    geographicDataLicense:'ODbL-1.0',geographicDataUrl:'https://www.openstreetmap.org/copyright'
  };
  if(existingIndex>=0)catalog.assets[existingIndex]=entry;else catalog.assets.push(entry);
}
await writeFile(path,JSON.stringify(catalog,null,2)+'\n');
