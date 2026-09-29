// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. Origin is the midpoint between the castle (~(56, 69)) and the
// stables (~(-69, -48)); the castle's north courtyard front faces north-north-west (bearing 342).
export const VIEWS = {
  overview: [[210, 150, 210], [0, 12, 8]],
  facade: [[24, 24, -26], [55, 13, 62]],          // the north front from Austin Terrace: gatehouse, porte-cochere, bay
  roof: [[110, 92, 130], [56, 16, 70]],           // above the castle: roofs, chimneys, towers
  structure: [[110, 32, 175], [56, 14, 70]],      // the south front from the escarpment: two round towers, conservatory
  stables: [[-10, 22, -70], [-69, 13, -70]],      // the stables from Walmer Road: brick front, water tower
  gatehouse: [[30, 20, 40], [46, 15, 60]],        // close on the gatehouse tower and porte-cochere
  scottish: [[112, 34, 108], [80, 24, 77]],       // the conical south-east tower
  crown: [[8, 40, 108], [30, 28, 86]],            // the pinnacled crown of the west tower
};
