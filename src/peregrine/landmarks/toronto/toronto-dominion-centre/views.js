// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south).
// Each value is [eye, target]. Keys used by the catalog record's inspection views.
// Origin is the centre of the five footprints. Bank Tower (37, 1); Banking Pavilion (65, -70);
// North Tower (-37, -40); West Tower (-93, 45); South Tower (23, 101). King Street runs
// along the north-north-west side, Bay Street along the east-north-east.
export const VIEWS = {
  overview: [[300, 230, -330], [-10, 80, 0]],
  facade: [[75, 6, -300], [10, 100, -20]],
  roof: [[-230, 420, 260], [10, 120, -10]],
  pavilion: [[150, 12, -200], [62, 5, -70]],
  plaza: [[-130, 22, -190], [20, 40, -10]],
  crown: [[40, 214, -95], [30, 200, -15]],
  street: [[230, 4, 260], [30, 70, 20]],
};
