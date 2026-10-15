// Mapped carriageway through the Pont Royal, south (Rue du Bac) to north (Avenue du Général
// Lemonnier), the one-way northbound traffic direction. © OpenStreetMap contributors, ODbL 1.0;
// https://www.openstreetmap.org/copyright. Dossier extract 2026-10-14.

// Rue du Bac (way 22874870), south to its corner on Quai Voltaire, then the link onto the
// bridge (ways 21124917 and 176408879).
export const SOUTH = [[2.3279733, 48.857709], [2.3280134, 48.8577654], [2.3283161, 48.8581935], [2.3283353, 48.8582212],
  [2.3283712, 48.8582746], [2.3287186, 48.858758], [2.3287489, 48.8588006], [2.3289458, 48.8590778], [2.3292188, 48.8594628],
  [2.3292364, 48.8594876], [2.329285, 48.8595512], [2.3293455, 48.8595773], [2.3294262, 48.8596091], [2.3294502, 48.859619]];
// The bridge carriageway (way 21124959): the south merge node and the north split node.
export const MERGE = [2.3295809, 48.8596719];
export const SPLIT = [2.3302619, 48.8605863];
// North of the split: ways 531267850 and 176408882 to Quai François Mitterrand, then Avenue du
// Général Lemonnier (way 318380798) up to the Tuileries underpass (way 14882405 is the tunnel).
export const NORTH = [[2.3302052, 48.8606935], [2.3301991, 48.8607058], [2.3301951, 48.8607123], [2.3300717, 48.8608967],
  [2.3300444, 48.860944], [2.3300977, 48.8610184], [2.3301721, 48.8611229], [2.3303072, 48.8612942], [2.33055, 48.8616238]];
