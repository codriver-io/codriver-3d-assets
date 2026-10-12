// Mapped carriageways retained for ownership validation; © OSM contributors, ODbL 1.0.
export const ROAD_WAYS = {"46160694": [[-6.2414727, 53.3463576], [-6.2414811, 53.3463986], [-6.2414752, 53.3464893], [-6.2412901, 53.3474349], [-6.2412836, 53.3474679]], "455486017": [[-6.2411541, 53.3474608], [-6.241344, 53.3464101], [-6.2413406, 53.346379], [-6.241313, 53.3463463]]};
// South-to-north average carriageway axis, continued through mapped road approaches.
// Smooth south quay approach: cubic control points estimated between mapped road endpoints.
const south=[-6.2414326,53.34635195],north=[-6.2412255,53.34746435];
const start=[-6.2412209,53.3462006],c1=[-6.2412999,53.3462361],c2=[south[0]-0.0002071*8/124,south[1]-0.0011124*8/124];
const tangent=[south[0]-0.0002071*.5/124,south[1]-0.0011124*.5/124];
const curve=Array.from({length:17},(_,i)=>{const t=i/16,u=1-t;return[0,1].map(k=>u*u*u*start[k]+3*u*u*t*c1[k]+3*u*t*t*c2[k]+t*t*t*tangent[k]);});
// Last vertex is on the actual Guild Street way 1313066295, with its tangent.
export const CENTERLINE=[...curve,south,north,[-6.2411692,53.3477404],[-6.2411656,53.3477639]];
export const SOUTH_BANK=south;
export const NORTH_BANK=north;
