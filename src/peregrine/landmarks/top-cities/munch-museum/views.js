// Inspector cameras, [eye, target] in model metres (+x east, +y up, +z south).
// The glazed head faces west-northwest; overview and facade sit on that side.
export const VIEWS = {
  overview: [[-88, 34, 78], [-8, 22, 2]],
  facade: [[-118, 32, 10], [-10, 32, 6]],
  back: [[86, 30, -24], [4, 26, 10]],
  roof: [[18, 150, 28], [-2, 16, 4]],
  street: [[-62, 9, -8], [-28, 9, 12]],
  detail: [[-58, 46, 22], [-12, 42, 6]],
  plan: [[-2, 210, 6], [-2, 0, 6]],
};
