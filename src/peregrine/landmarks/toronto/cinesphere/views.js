// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south). [eye, target].
// The origin is the centre of the complex; the sphere stands at about (-24, 0, 102) and the spine runs north.
export const VIEWS = {
  overview: [[150, 95, -110], [-20, 12, 35]],            // aerial from the north-east over the pods, dome behind
  facade: [[-78, 9, 96], [-16, 17, 41]],                 // a pod from the lake edge, as photographed
  roof: [[-24, 140, 90], [-24, 5, 40]],                  // straight down: five diamond pods, spine and ball
  structure: [[-80, 8, 165], [-24, 15, 102]],            // the ball from the south-west
  dome: [[-60, 40, 100], [-24, 22, 102]],                // the geodesic frame close up
  spine: [[-45, 14, -130], [-30, 9, -60]],               // the glazed walkway and its pipe supports
};
