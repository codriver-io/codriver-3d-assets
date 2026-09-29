import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { ROOT } from './asset-catalog.mjs';

async function files(dir) {
  const result = [];
  for (const e of await readdir(resolve(ROOT, dir), { withFileTypes: true })) {
    if (e.isDirectory()) result.push(...await files(join(dir, e.name)));
    else result.push(join(dir, e.name));
  }
  return result;
}
const skill = '.agents/skills/build-3d-landmarks';
const skillFiles = await files(skill);
for (const file of skillFiles) {
  const canonical = await readFile(resolve(ROOT, file));
  const claude = await readFile(resolve(ROOT, file.replace('.agents/', '.claude/')));
  assert.deepEqual(claude, canonical, 'Claude and Codex skill content must match: ' + file);
}
const body = await readFile(resolve(ROOT, skill, 'SKILL.md'), 'utf8');
assert.match(body, /^---\nname: build-3d-landmarks\ndescription: .+\n---\n/);
const paths = ['README.md', 'CONTRIBUTING.md', 'AGENTS.md', 'CLAUDE.md', 'docs/model-submission.md',
  ...await files('docs/adr'), ...await files('.github'), ...skillFiles];
for (const file of paths) {
  const content = await readFile(resolve(ROOT, file), 'utf8');
  assert.ok(!/\/Users\/|\/var\/folders\/|op:\/\/|codriver\.test|-----BEGIN [A-Z ]*PRIVATE KEY-----|gh[op]_[A-Za-z0-9]{30,}/.test(content), 'Private material in ' + file);
  if (!file.endsWith('.md')) continue;
  for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (!target || /^[a-z]+:/i.test(target)) continue;
    await access(resolve(dirname(resolve(ROOT, file)), decodeURI(target)));
  }
}
for (const file of ['.github/ISSUE_TEMPLATE/landmark.yml', '.github/ISSUE_TEMPLATE/model-problem.yml',
  '.github/pull_request_template.md', '.github/workflows/validate.yml']) await access(resolve(ROOT, file));
assert.match(await readFile(resolve(ROOT, 'site/codriver-helmet.svg'), 'utf8'), /<svg/);
console.log('PASS contribution links, public skill confidentiality scan, matching Codex/Claude discovery and GitHub templates');
