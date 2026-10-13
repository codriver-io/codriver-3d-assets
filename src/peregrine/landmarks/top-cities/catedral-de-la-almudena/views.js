import { world } from './catedral-de-la-almudena-plan.js';
const view=(eye,target)=>[world(...eye),world(...target)];
export const VIEWS = {
  overview: view([-140,105,-170],[0,29,-12]),
  facade: view([0,33,-175],[0,30,-25]),
  roof: view([70,185,30],[0,23,-12]),
  back: view([65,44,135],[0,25,0]),
  street: view([102,9,-60],[0,21,-15]),
  detail: view([-34,42,-94],[-16,39,-56]),
  top: view([0,210,-12],[0,0,-12]),
};
