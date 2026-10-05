import { P, SA } from './puerta-de-alcala-frame.js';

// Cameras in model metres. facade looks at the inscribed east front, along the through-axis.
export const VIEWS = {
  overview: [P(SA + 28, 15, 48), P(SA, 9, 0)],
  facade: [P(SA, 11, 62), P(SA, 9, 0)],
  west: [P(SA, 11, -62), P(SA, 8, 0)],
  roof: [P(SA + 10, 55, 12), P(SA, 14, 0)],
  street: [P(SA + 7, 2.2, 36), P(SA, 7, 0)],
  detail: [P(SA, 18.5, 14), P(SA, 18.28, 3.55)],
};
