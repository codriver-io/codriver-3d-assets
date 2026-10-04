// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south, origin = the centre of the French
// pavilion's drum). The drum's flared east wing faces east-south-east; the entrance canopy and drop-off face north-east.
export const VIEWS = {
  overview: [[150, 85, -120], [0, 14, 15]],
  facade: [[110, 20, 55], [10, 18, 0]],
  roof: [[60, 150, 80], [0, 25, 20]],
  canopy: [[70, 14, -60], [8, 12, -35]],
  terraces: [[-105, 25, -10], [-35, 15, -5]],
  quebec: [[-110, 28, 150], [-12, 14, 105]],
  link: [[100, 26, 85], [5, 8, 40]],
  back: [[-130, 45, 60], [-5, 15, 25]],
  plan: [[0, 300, 22], [0, 0, 21]],
};
