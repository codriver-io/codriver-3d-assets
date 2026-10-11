// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The roof is high toward the
// north-east and south-west and dips toward the south-east (the lettering side) and north-west.
export const VIEWS = {
  overview: [[156, 66, 110], [0, 22, 0]],     // from the south-east, above the Stampede Park lot: the saddle against the sky
  facade: [[86, 13, 150], [0, 17, 0]],        // the south-east low side, straight on: portal, lettering, loop, concourse band
  roof: [[70, 230, 120], [0, 24, 0]],         // from above: the saddle and its edge ring
  west: [[-132, 14, 74], [0, 20, 0]],         // the south-west high end: west entrance, stairs, red towers, yellow stair tower
  northwest: [[-84, 15, -146], [0, 17, 0]],   // the north-west low side, the way downtown sees it
  street: [[28, 2.6, 100], [20, 15, 52]],     // plaza level under the south-east portal
  sign: [[48, 9, 84], [32, 18.5, 58]],        // the lettering and the roof loop, close
  tower: [[-118, 7, 130], [-52, 12, 52]],     // the red towers and the pavilion at the west end, close
  eave: [[-52, 1.8, -98], [-32, 19, -58]],     // looking up at the north-west portal and the roof ring's underside
};
