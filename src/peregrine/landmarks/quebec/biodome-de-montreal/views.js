// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// The long axis runs south-west to north-east; the glazed entrance arch faces west-south-west (toward the stadium).
export const VIEWS = {
  overview: [[-180, 120, 150], [0, 12, 0]],      // from the Olympic Stadium side, south-west and above
  facade: [[-165, 6, 38], [-70, 9, 30]],         // straight on at the entrance arch
  roof: [[110, 175, 210], [0, 10, 0]],           // the whole shell from the south-east
  back: [[150, 90, -190], [0, 8, 0]],            // north-east, the back of the shell and the long edges
  street: [[-95, 2.5, 120], [-60, 5, 60]],       // plaza level at the south-west foot
  detail: [[40, 50, -10], [0, 28, 0]],           // the spine's skylights and ribs
  plan: [[0, 320, 0], [0, 0, 0]],                // straight down, north up
  tower: [[-150, 150, 170], [0, 8, 0]],          // from the Olympic Stadium tower, the vantage of the reference photos
};
