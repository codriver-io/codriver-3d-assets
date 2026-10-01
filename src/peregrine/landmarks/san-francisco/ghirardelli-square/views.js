// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
// The sign faces the bay (north, -z). The clock tower stands at the south-east corner (+x, +z).
export const VIEWS = {
  overview: [[-75, 60, -150], [5, 15, 10]], // from the bay, north-west: the sign over the plaza
  sign: [[-3, 27, -70], [11.6, 27, 27]], // lettering head-on from the water side
  facade: [[-30, 24, -75], [5, 14, 25]], // plaza level, Mustard and Cocoa facades
  roof: [[110, 140, -95], [0, 14, 5]], // oblique from above
  tower: [[130, 24, -25], [66, 22, 29]], // clock tower from Larkin St
  clock: [[72, 24, 5], [66, 21.8, 25.7]], // north dial close up
  back: [[-40, 40, 140], [0, 15, 30]], // North Point St side: the scaffold behind the sign
  larkin: [[160, 22, 30], [45, 10, 0]], // Larkin St frontage
};
