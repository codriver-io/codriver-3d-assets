// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The row
// runs north (-z) to south (+z) along Steiner Street with the fronts facing west (-x).
export const VIEWS = {
  postcard: [[-74, 9, -3], [0, 7.5, -3]], // the postcard: from the slope of Alamo Square, level with the gables
  overview: [[-52, 26, -4], [0, 7, 0]], // from Alamo Square: the whole row
  facade: [[-34, 9, -2], [0, 7, 0]], // head on across Steiner Street
  roof: [[-14, 58, 22], [1, 8, 0]], // from above: gables, ridges, chimneys
  gables: [[-30, 11, 18], [-6, 10, 2]], // the gables at the south end, from the street
  bay: [[-16, 7, 10], [-8, 5.5, 5]], // close on a canted bay, balcony and stair
  north: [[-10, 8, -52], [0, 7, -6]], // from Hayes Street: the mansion and the row receding
  rear: [[46, 14, -10], [0, 8, 0]], // the back elevations from the east
};
