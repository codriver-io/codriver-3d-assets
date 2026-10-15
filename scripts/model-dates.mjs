import { execFileSync } from 'node:child_process';
import { ROOT } from './asset-catalog.mjs';

// Commits that only restamped GLB metadata (licence, source links) without changing any model.
const METADATA_ONLY = new Set([
  'ac4bd1768de2e7e32983c18282ccbf2e0c97f085', // Move public asset source links to codriver-io
]);

const git = (root, args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 256 << 20 }).trim();

// When each model reached the library and when its exported geometry last changed, from the history of
// its committed files: { id: { added, updated? } } as YYYY-MM-DD. Following the first parent dates a pull
// request's models by its merge, the day they went public. A model changed again on the day it was
// added has no separate update, and an uncommitted model is added today. Without full history (a shallow
// clone) there are no dates, and the library hides its date sorting.
export function modelDates(assets, root = ROOT) {
  let log;
  try {
    if (git(root, ['rev-parse', '--is-shallow-repository']) !== 'false') return {};
    log = git(root, ['log', '--first-parent', '--diff-merges=first-parent', '--no-renames', '--format=@%H %cs', '--name-only', '--', 'public/models']);
  } catch { return {}; }
  const owners = new Map();
  for (const entry of assets) {
    const glbs = Object.values(entry.model?.assets || {}).map((file) => `public${file.url}`);
    for (const path of glbs) owners.set(path, { entry, glb: true });
    if (entry.manifest) owners.set(`public${entry.manifest}`, { entry, glb: false });
  }
  const dates = {};
  let commit, date;
  // Newest first: the last commit seen is the addition, the first non-metadata GLB change the update.
  for (const line of log.split('\n')) {
    if (line.startsWith('@')) { [commit, date] = line.slice(1).split(' '); continue; }
    const owner = line && owners.get(line);
    if (!owner) continue;
    const d = (dates[owner.entry.id] ||= {});
    d.added = date;
    if (owner.glb && !d.updated && !METADATA_ONLY.has(commit)) d.updated = date;
  }
  for (const d of Object.values(dates)) if (d.updated === d.added) delete d.updated;
  // A model with no history yet is being added by the uncommitted change this build is for: date it today.
  const today = new Date().toISOString().slice(0, 10);
  for (const entry of assets) dates[entry.id] ||= { added: today };
  return dates;
}
