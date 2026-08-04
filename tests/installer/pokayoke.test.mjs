// Poka-yoke drift devices (audit 2026-07-31). Every test here guards a
// mistake class this repo has already suffered: hand-lists drifting from the
// filesystem, embedded copies drifting from their source files, version
// numbers drifting from each other, and mode logic drifting between the
// shared JS module and the two shell statuslines.
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const require = createRequire(import.meta.url);
const CONFIG = require(path.join(ROOT, 'src', 'hooks', 'ta-config.js'));

const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');

// ── Version unification: package.json == PINNED_REF == shim pins == git tag ──

test('poka-yoke: one version everywhere (package, PINNED_REF, both shims, latest tag)', () => {
  const pkg = JSON.parse(read('package.json')).version;
  const pinned = read('bin', 'install.js').match(/PINNED_REF = [^']*'(v[\d.]+)'/)[1];
  assert.equal(pinned, 'v' + pkg, `PINNED_REF ${pinned} != package version v${pkg}`);

  const shPin = read('install.sh').match(/PINNED_REF="(v[\d.]+)"/)[1];
  assert.equal(shPin, pinned, 'install.sh pin drifted');
  const psPin = read('install.ps1').match(/\$PinnedRef = "(v[\d.]+)"/)[1];
  assert.equal(psPin, pinned, 'install.ps1 pin drifted');

  // Latest v* tag must agree — skipped gracefully outside a git checkout.
  // Exception: mid-release (on a release/X.Y.Z or hotfix branch) the pins are
  // one ahead by design — the tag is created at release_finish. Then the pins
  // must equal the in-flight release version instead.
  let tag = null, branch = null;
  try {
    tag = execFileSync('git', ['describe', '--tags', '--abbrev=0', '--match', 'v*'],
      { cwd: ROOT, encoding: 'utf8' }).trim();
    branch = execFileSync('git', ['symbolic-ref', '--short', 'HEAD'],
      { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch (e) { /* no git → skip */ }
  const releaseMatch = branch && branch.match(/^(?:release|hotfix)\/(\d+\.\d+\.\d+)$/);
  if (releaseMatch) {
    assert.equal(pinned, 'v' + releaseMatch[1],
      `on ${branch} the pins must already say v${releaseMatch[1]} (bump before make release_finish)`);
  } else if (tag) {
    assert.equal(tag, pinned, `latest tag ${tag} != PINNED_REF ${pinned}`);
  }
});

// ── Name lists vs filesystem ──

test('poka-yoke: HOOK_FILES lists (js + sh) match each other and the manifest', () => {
  const jsList = read('bin', 'install.js')
    .match(/const HOOK_FILES = \[([\s\S]*?)\];/)[1]
    .match(/'([^']+)'/g).map(s => s.slice(1, -1));
  const shList = read('src', 'hooks', 'install.sh')
    .match(/HOOK_FILES=\(([^)]*)\)/)[1]
    .match(/"([^"]+)"/g).map(s => s.slice(1, -1));
  assert.deepEqual(shList.sort(), [...jsList].sort(),
    'src/hooks/install.sh HOOK_FILES drifted from bin/install.js');

  for (const f of jsList) {
    assert.ok(fs.existsSync(path.join(ROOT, 'src', 'hooks', f)), `hook file missing: ${f}`);
  }
  const manifest = read('src', 'hooks', 'checksums.sha256')
    .trim().split('\n').map(l => l.trim().split(/\s+/).pop()).sort();
  assert.deepEqual(manifest, [...jsList].sort(), 'checksums.sha256 covers a different file set');
});

test('poka-yoke: checksums.sha256 matches the actual hook file bytes', () => {
  for (const line of read('src', 'hooks', 'checksums.sha256').trim().split('\n')) {
    const [hash, file] = line.trim().split(/\s+/);
    const actual = crypto.createHash('sha256')
      .update(fs.readFileSync(path.join(ROOT, 'src', 'hooks', file))).digest('hex');
    assert.equal(actual, hash, `checksum stale for ${file} — regenerate checksums.sha256`);
  }
});

test('poka-yoke: skill-dir lists in the installer match skills/ on disk', () => {
  const src = read('bin', 'install.js');
  const onDisk = fs.readdirSync(path.join(ROOT, 'skills'))
    .filter(d => fs.existsSync(path.join(ROOT, 'skills', d, 'SKILL.md'))).sort();
  for (const name of ['HERMES_SKILL_DIRS', 'OPENCODE_SKILL_DIRS']) {
    const list = src.match(new RegExp(`const ${name}\\s*=\\s*\\[([^\\]]*)\\]`))[1]
      .match(/'([^']+)'/g).map(s => s.slice(1, -1)).sort();
    assert.deepEqual(list, onDisk, `${name} drifted from skills/ directory`);
  }
});

test('poka-yoke: every command ships .md + .toml and appears in user-scope mirror set', () => {
  const cmds = fs.readdirSync(path.join(ROOT, 'commands'));
  const mds = cmds.filter(f => f.endsWith('.md'));
  assert.ok(mds.length >= 8, 'commands/ suspiciously empty');
  for (const md of mds) {
    const toml = md.replace(/\.md$/, '.toml');
    assert.ok(cmds.includes(toml), `${md} has no Gemini .toml sibling`);
  }
});

// ── Byte-sync duplicates ──

test('poka-yoke: caveman-init embedded RULE_BODY is byte-equal to the rule file', () => {
  const tool = require(path.join(ROOT, 'src', 'tools', 'ta-init.js'));
  const file = read('src', 'rules', 'transatlantic-activate.md').trimEnd() + '\n';
  assert.equal(tool.RULE_BODY, file, 'embedded RULE_BODY drifted from src/rules/transatlantic-activate.md');
  assert.ok(file.includes(tool.SENTINEL), 'SENTINEL no longer appears in the rule body');
});

test('poka-yoke: openclaw embedded bootstrap fallback is byte-equal to the file', () => {
  const oc = require(path.join(ROOT, 'bin', 'lib', 'openclaw.js'));
  assert.equal(oc.loadBootstrapSnippet(ROOT), oc.loadBootstrapSnippet(null),
    'openclaw.js embedded fallback drifted from src/rules/transatlantic-openclaw-bootstrap.md');
});

test('poka-yoke: plugin mirror copies are byte-equal to their sources', () => {
  const pairs = [
    ['skills/transatlantic/SKILL.md', 'plugins/transatlantic/skills/transatlantic/SKILL.md'],
    ['skills/ta-compress/SKILL.md', 'plugins/transatlantic/skills/ta-compress/SKILL.md'],
    ['skills/crew/SKILL.md', 'plugins/transatlantic/skills/crew/SKILL.md'],
    ['agents/crew-locator.md', 'plugins/transatlantic/agents/crew-locator.md'],
    ['agents/crew-editor.md', 'plugins/transatlantic/agents/crew-editor.md'],
    ['agents/crew-reviewer.md', 'plugins/transatlantic/agents/crew-reviewer.md'],
  ];
  for (const [src, mirror] of pairs) {
    assert.equal(read(...mirror.split('/')), read(...src.split('/')),
      `${mirror} stale vs ${src} — CI sync did not run (check workflow trigger branches)`);
  }
});

// ── Mode logic replicated in shells ──

function shellCaseModes(file, text) {
  // Collect every mode name that appears in the whitelist / alias case arms.
  const arms = [...text.matchAll(/^\s*(?:'[^']+'|[a-z0-9|-]+)\)?\s*(?:\{|;;|\|)/gm)];
  const names = new Set();
  for (const m of text.matchAll(/(?:^|\|)\s*'?([a-z][a-z0-9-]*)'?(?=\s*[)|])/gm)) names.add(m[1]);
  return names;
}

test('poka-yoke: statusline scripts cover every VALID_MODE and alias', () => {
  const { VALID_MODES, LEGACY_ALIASES } = CONFIG;
  const expected = VALID_MODES.filter(m => m !== 'off');
  for (const [file, text] of [
    ['ta-statusline.sh', read('src', 'hooks', 'ta-statusline.sh')],
    ['ta-statusline.ps1', read('src', 'hooks', 'ta-statusline.ps1')],
  ]) {
    for (const mode of expected) {
      assert.ok(text.includes(mode),
        `${file} does not mention mode '${mode}' — its whitelist/alias map drifted from VALID_MODES`);
    }
    for (const [legacy, canonical] of Object.entries(LEGACY_ALIASES)) {
      assert.ok(text.includes(legacy) && text.includes(canonical),
        `${file} missing alias mapping ${legacy} -> ${canonical}`);
    }
  }
});

// ── SKILL table coupling ──

test('poka-yoke: every prose level has a SKILL.md table row and example lines', () => {
  const { VALID_MODES, LEGACY_ALIASES, INDEPENDENT_MODES } = CONFIG;
  const skill = read('skills', 'transatlantic', 'SKILL.md');
  const canonical = VALID_MODES.filter(m =>
    m !== 'off' && !INDEPENDENT_MODES.includes(m) && !(m in LEGACY_ALIASES));
  for (const level of canonical) {
    assert.ok(skill.includes(`| **${level}** |`),
      `SKILL.md has no intensity-table row for '${level}' — the SessionStart filter would emit no rules for it`);
    assert.ok(new RegExp(`^- ${level}: `, 'm').test(skill),
      `SKILL.md has no example line for '${level}'`);
  }
});

// ── No upstream marketing in user-facing installer output ──

test('poka-yoke: installer never shows caveman-era strings or upstream URLs to users', () => {
  const sources = [
    ['bin/install.js', read('bin', 'install.js')],
    ['install.sh', read('install.sh')],
    ['install.ps1', read('install.ps1')],
    ['src/hooks/install.sh', read('src', 'hooks', 'install.sh')],
    ['src/hooks/uninstall.sh', read('src', 'hooks', 'uninstall.sh')],
  ];
  for (const [name, src] of sources) {
    for (const banned of ['caveman.so', "say 'caveman", 'run /caveman ', '/caveman-stats', '🪨',
                          'caveman — installer', 'caveman: Node', 'Uninstalling caveman',
                          'JuliusBrussee/caveman/main']) {
      assert.ok(!src.includes(banned),
        `${name} still contains user-facing caveman string: ${banned}`);
    }
  }
});

// ── Shared maps actually shared ──

test('poka-yoke: INDEPENDENT_MODES and REINFORCEMENT defined once, in caveman-config', () => {
  assert.ok(Array.isArray(CONFIG.INDEPENDENT_MODES) && CONFIG.INDEPENDENT_MODES.length === 3);
  assert.ok(CONFIG.REINFORCEMENT && CONFIG.REINFORCEMENT.transatlantic);
  for (const f of ['src/hooks/ta-mode-tracker.js', 'src/hooks/ta-activate.js', 'src/plugins/opencode/plugin.js']) {
    const text = read(...f.split('/'));
    assert.ok(!/new Set\(\['commit', 'review', 'compress'\]\)/.test(text),
      `${f} redefines INDEPENDENT_MODES instead of importing it`);
  }
});
