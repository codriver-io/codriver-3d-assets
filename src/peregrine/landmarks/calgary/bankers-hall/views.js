// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The two towers stand about
// 70 m apart (West at x -25, East at x +43), 197 m to the mast tips; the crowns are the signature.
export const VIEWS = {
  overview: [[-330, 150, 330], [5, 100, 0]],
  facade: [[150, 14, 30], [43, 95, 10]], // 2 Street SW face of the East tower, looking up the stone-and-glass grid
  roof: [[90, 300, 160], [9, 180, 0]], // both crowns from above
  crown: [[-80, 195, 100], [-25, 183, 0]], // the West crown and its pedimented slot at eye level
  south: [[10, 60, 330], [10, 100, 0]], // the flat south faces with the slots and the stepped sides
  north: [[10, 100, -330], [10, 100, 0]], // the stepped north ends
  podium: [[120, 35, 100], [5, 8, 0]], // the retail podium and the glass roof over the galleria
};
