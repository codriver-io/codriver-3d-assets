// Geographic registration measured from OpenStreetMap footprints (2026-09-29).
// © OpenStreetMap contributors, ODbL-1.0: https://www.openstreetmap.org/copyright
// Angles turn authoring X/Z into east/south; heights remain real metres.
// Sources, reference points and partial-building scope: docs/paris/placement.md.
export const PARIS_BUILDING_FRAMES = {
  "paris-tour-eiffel": {
    "origin": [
      2.294498492540051,
      48.85826056721498
    ],
    "rotation": 0.79866267,
    "authoringCenter": [
      0,
      0
    ],
    "scaleXZ": [
      1,
      1
    ]
  },
  "paris-arc-de-triomphe": {
    "origin": [
      2.2950404519841263,
      48.87377871888875
    ],
    "rotation": 1.12835536,
    "authoringCenter": [
      0,
      0
    ],
    "scaleXZ": [
      1,
      1
    ]
  },
  "paris-notre-dame": {
    "origin": [
      2.3498344847494415,
      48.85289778949129
    ],
    "rotation": -2.03487937,
    "authoringCenter": [
      0,
      -5.59
    ],
    "scaleXZ": [
      1,
      1
    ]
  },
  "paris-sacre-coeur": {
    "origin": [
      2.3430176157065397,
      48.886795537472906
    ],
    "rotation": 0.07731809,
    "authoringCenter": [
      0,
      -1.325
    ],
    "scaleXZ": [
      0.9,
      0.947
    ]
  },
  "paris-invalides": {
    "origin": [
      2.312541783404777,
      48.85504840710074
    ],
    "rotation": -0.07976155,
    "authoringCenter": [
      0,
      1.75
    ],
    "scaleXZ": [
      1,
      1
    ]
  },
  "paris-louvre": {
    "origin": [
      2.335852,
      48.861014
    ],
    "rotation": -0.3577925,
    "authoringCenter": [
      170,
      0
    ],
    "scaleXZ": [
      1,
      1
    ]
  },
  "paris-palais-garnier": {
    "origin": [
      2.3317068760420785,
      48.87203874002633
    ],
    "rotation": 0.27698375,
    "authoringCenter": [
      0,
      -5.525
    ],
    "scaleXZ": [
      1,
      1.079
    ]
  },
  "paris-grand-palais": {
    "origin": [
      2.3122732320356563,
      48.86614932499869
    ],
    "rotation": 0.01169371,
    "authoringCenter": [
      0,
      0
    ],
    "scaleXZ": [
      1.084,
      1.159
    ]
  },
  "paris-petit-palais": {
    "origin": [
      2.314956519804263,
      48.86602192067738
    ],
    "rotation": -0.0837758,
    "authoringCenter": [
      -1.545,
      0
    ],
    "scaleXZ": [
      0.802,
      1.043
    ]
  },
  "paris-musee-orsay": {
    "origin": [
      2.3265022171373246,
      48.859951400526356
    ],
    "rotation": -0.42062435,
    "authoringCenter": [
      -0.34,
      -0.95
    ],
    "scaleXZ": [
      0.866,
      0.877
    ]
  },
  "paris-pantheon": {
    "origin": [
      2.3460828744678213,
      48.8462024625551
    ],
    "rotation": 1.25244827,
    "authoringCenter": [
      0,
      -9.43
    ],
    "scaleXZ": [
      1,
      0.921
    ]
  },
  "paris-hotel-de-ville": {
    "origin": [
      2.352531146338002,
      48.85642610835624
    ],
    "rotation": 1.22277767,
    "authoringCenter": [
      0,
      -3.95
    ],
    "scaleXZ": [
      0.967,
      0.878
    ]
  },
  "paris-madeleine": {
    "origin": [
      2.3244654824718003,
      48.87002796852134
    ],
    "rotation": 2.69513743,
    "authoringCenter": [
      0,
      0
    ],
    "scaleXZ": [
      1,
      1
    ]
  },
  "paris-conciergerie": {
    "origin": [
      2.3449435870433093,
      48.8563941308924
    ],
    "rotation": -0.3577925,
    "authoringCenter": [
      0,
      0
    ],
    "scaleXZ": [
      1.08,
      1
    ]
  },
  "paris-institut-de-france": {
    "origin": [
      2.3370972575098756,
      48.857320239742954
    ],
    "rotation": -0.28797933,
    "authoringCenter": [
      0,
      0
    ],
    "scaleXZ": [
      0.77,
      1
    ]
  }
};

export function applyParisBuildingFrame(root, id) {
  const frame = PARIS_BUILDING_FRAMES[id];
  const [cx, cz] = frame.authoringCenter;
  const [sx, sz] = frame.scaleXZ;
  root.traverse(o => {
    if (o.isMesh) {
      o.geometry.translate(-cx, 0, -cz);
      o.geometry.scale(sx, 1, sz);
    }
  });
  root.rotation.y = frame.rotation;
  return root;
}
