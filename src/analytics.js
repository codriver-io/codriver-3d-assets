// Plausible custom events for the public library (scripts/analytics.mjs loads Plausible on the production hosts
// only; elsewhere window.plausible is undefined and this is a no-op). Props are bounded: catalog ids and labels.
export function track(name, props) {
  try { window.plausible?.(name, { props }); } catch { /* analytics must never break the library */ }
}
