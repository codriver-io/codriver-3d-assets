// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south).
export const VIEWS = {
  overview: [[130, 36, 70], [0, 14, -15]], // from the south-east, the whole structure
  facade: [[70, 10, -40], [-5, 15, -20]], // from the east bank by the pylon pier, as a walker sees it
  roof: [[10, 110, -20], [0, 8, -20]], // plan view of the deck, pylons and stay fans
  deck: [[3, 19, 75], [0, 14, -30]], // along the deck from the south, between the stay planes
  underside: [[-3, 6.5, 25], [0, 10.5, -40]], // from the hung path up at the soffit art panels
  tower: [[-38, 22, 12], [0, 20, -28]], // the pylon pair and the stay fans from the west
};
