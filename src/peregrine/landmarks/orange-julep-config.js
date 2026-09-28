// Dimensions are a visual reconstruction, not a survey. See docs/3d-orange-julep.md.
export const ORANGE_JULEP = {
  id: 'orange-julep', name: 'Gibeau Orange Julep',
  origin: [-73.65678575, 45.49571015],
  diameter: 18.3, height: 15.8, sphereCenterY: 6.65,
  frontageBearing: 55,
  // Estimated position of the separate Décarie roadside sign; outside driveways.
  sign: [49, 1],
};

export const ORANGE_JULEP_PALETTES = {
  light: { orange: '#ed5718', seam: '#ce501c', stone: '#928879', trim: '#e7e4cf', glass: '#273a3e', sign: '#f4eccf', ink: '#b72c12', metal: '#434846' },
  dark: { orange: '#b44d1a', seam: '#98431c', stone: '#615f58', trim: '#a9b7b9', glass: '#596c62', sign: '#ffedb5', ink: '#d95323', metal: '#37424a' },
};
