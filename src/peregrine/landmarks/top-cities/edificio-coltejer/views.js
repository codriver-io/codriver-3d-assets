// Inspector cameras, [eye, target] in model metres (+X east, +Y up, +Z south).
// The tower's plan centre sits near (-3, 2). The recognition view is the west corner:
// the finned long face meeting the white needle (Plaza Botero side). Distances assume
// a portrait frame (shot --size 720x1100, fov 40); a landscape frame reduces the tower to a sliver.
export const VIEWS = {
  overview: [[-254, 22, 69], [-3, 90, 2]],
  facade: [[-117, 112, 33], [-3, 145, 2]],
  gable: [[-65, 150, -35], [-3, 164, 2]],
  roof: [[-47, 236, 14], [-3, 168, 2]],
  street: [[-59, 3, 17], [-3, 42, 2]],
  crown: [[-52, 156, -15], [-3, 166, 2]],
  annex: [[52, 32, -48], [8, 12, -10]],
};
