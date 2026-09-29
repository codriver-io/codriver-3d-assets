// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. The hotel's long axis runs 16.6 deg north of east; Front Street is on the
// south side. Keys used by the catalog record's inspection views.
export const VIEWS = {
  overview: [[-120, 110, 250], [-10, 52, 0]],
  facade: [[70, 34, 215], [0, 50, 0]],
  roof: [[-70, 190, 105], [-16, 100, 5]],
  crown: [[-32, 112, 88], [-16, 103, 6]],
  street: [[60, 3.5, 58], [46, 14, 14]],
  west: [[-185, 32, 70], [-70, 36, 20]],
  north: [[-60, 65, -210], [0, 40, 0]],
  east: [[180, 55, 30], [70, 38, 0]],
  sw: [[-150, 8, 150], [-25, 60, 15]],
  se: [[190, 14, 170], [20, 62, 5]],
  structure: [[-14, 240, 20], [-4, 40, 0]],
};
