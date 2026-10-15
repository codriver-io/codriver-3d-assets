// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The plaque and vent face
// south-south-east (164 degrees).
export const VIEWS = {
  overview: [[5.5, 3.6, 8.5], [0, 2.4, 0]],     // the whole clock from the Water Street roadway side
  facade: [[1.2, 2.2, 9], [0, 2.4, 0]],         // street level at the plaque side: plinth, works window, dial, roof
  roof: [[2.8, 7.4, 3.4], [0, 4.2, 0]],         // above the pagoda roof: the five whistles
  dial: [[0.8, 3.5, 3.4], [0, 3.45, 0]],        // a clock face close up
  back: [[-5.5, 3.2, -8.5], [0, 2.4, 0]],       // the far side: no plaque, same dial and works window
  plan: [[0, 14, 0.1], [0, 0, 0]],              // straight down over the pad and the bollard ring
};
