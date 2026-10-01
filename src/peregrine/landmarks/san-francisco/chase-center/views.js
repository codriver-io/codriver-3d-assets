// Inspector camera presets in the model's local metres (+X east, +Y up, +Z south). Each value is [eye, target].
// The glass entrance front faces east; the white drum wraps the west, north and south.
export const VIEWS = {
  overview: [[205, 78, 175], [10, 17, -4]],      // from the south-east corner (16th Street and Terry A. Francois Blvd)
  facade: [[175, 15, -6], [58, 17, 0]],          // the glass front and its sign, straight on from the east
  roof: [[40, 170, 120], [0, 30, 0]],            // the domed roof and the visor from above
  west: [[-190, 24, 30], [-40, 16, 0]],          // the drum's bands, from Third Street
  street: [[128, 2.4, 78], [60, 14, 20]],        // plaza level at the south-east end of the prow
  sign: [[112, 12, 14], [68, 17, 28]],           // the CHASE CENTER sign, close
  visor: [[122, 4, -8], [62, 29, -10]],          // looking up at the timber soffit and columns
};
