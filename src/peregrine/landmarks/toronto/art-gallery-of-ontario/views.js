// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. Keys used by the catalog record's inspection views.
export const VIEWS = {
  overview: [[-178, 85, -73], [8, 14, 8]],       // from Dundas/Beverley, high: hull, both sails, blue box behind
  facade: [[-95, 14, -76], [-6, 13, -38]],       // Dundas Street frontage: piers, glass belt, ribbed hull
  roof: [[-14, 150, 25], [1, 15, 5]],            // straight down: hull ridge, Walker Court roof, roof plant
  structure: [[78, 22, 107], [1, 24, 47]],       // Grange Park side: blue box over the brick base and The Grange
  window: [[53, 22, 76], [1, 26, 52]],           // the recessed 28 m window and the stair pods
  sail: [[81, 14, -98], [58, 16, -50]],          // the east tear: framed glass sail over its skirt
};
