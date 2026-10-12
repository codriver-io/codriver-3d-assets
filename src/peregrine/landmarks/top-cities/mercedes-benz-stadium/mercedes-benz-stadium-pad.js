// Terrain pad for Full 3D world, precomputed from the footprint, five interior datum references and the
// renderer lattice (near TIN halo plus the coarser far-TIN support nodes), so the generator needs no runtime import.
// Regenerate if FOOTPRINTS or the renderer lattice change.
export const TERRAIN_PAD = {"datum":"median","featherM":18,"rings":[[[-84.4038412722538,33.75402970155682],[-84.40097378367959,33.75397245460845],[-84.40028281632041,33.75397245460845],[-84.39834378633995,33.75402970155682],[-84.39834378633995,33.75631685653877],[-84.39971707735558,33.757458614560655],[-84.40246798123817,33.757458614560655],[-84.4038412722538,33.75631685653877]]],"refs":[[-84.4008481722,33.755414838],[-84.40185,33.7554],[-84.3998,33.7554],[-84.40085,33.7561],[-84.40085,33.7547]]};
