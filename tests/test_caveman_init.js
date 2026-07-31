#!/usr/bin/env node
// Tests for src/tools/caveman-init.js — fixture-based.
// Run: node tests/test_caveman_init.js

const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const INIT = path.join(ROOT, 'src', 'tools', 'caveman-init.js');

let passed = 0;
let failed = 0;

// Point OPENCLAW_WORKSPACE at a nonexistent dir inside the fixture so the
// openclaw target reports skipped-workspace-missing instead of writing to
// the developer's real ~/.openclaw/workspace.
function runInit(tmp, ...args) {
  return execFileSync(process.execPath, [INIT, tmp, ...args], {
    encoding: 'utf8',
    env: { ...process.env, OPENCLAW_WORKSPACE: path.join(tmp, 'no-openclaw') },
  });
}

function test(name, fn) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'caveman-init-test-'));
  try {
    fn(tmp);
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.error(`  ✗ ${name}\n    ${e.message}`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

console.log('caveman-init tests\n');

test('greenfield: creates all rule files with proper frontmatter', (tmp) => {
  runInit(tmp);
  const cursor = fs.readFileSync(path.join(tmp, '.cursor/rules/caveman.mdc'), 'utf8');
  assert.match(cursor, /alwaysApply: true/);
  assert.match(cursor, /Speak in the transatlantic register/);
  const windsurf = fs.readFileSync(path.join(tmp, '.windsurf/rules/caveman.md'), 'utf8');
  assert.match(windsurf, /trigger: always_on/);
  const cline = fs.readFileSync(path.join(tmp, '.clinerules/caveman.md'), 'utf8');
  assert.match(cline, /^Speak in the transatlantic/);
  const copilot = fs.readFileSync(path.join(tmp, '.github/copilot-instructions.md'), 'utf8');
  assert.match(copilot, /Speak in the transatlantic/);
  const agents = fs.readFileSync(path.join(tmp, 'AGENTS.md'), 'utf8');
  assert.match(agents, /Speak in the transatlantic/);
  const opencode = fs.readFileSync(path.join(tmp, '.opencode/AGENTS.md'), 'utf8');
  assert.match(opencode, /Speak in the transatlantic/);
});

test('idempotent: re-running on a clean install skips all', (tmp) => {
  runInit(tmp);
  const out = runInit(tmp);
  // 6 repo rule files skipped-already-installed + openclaw skipped (no workspace)
  assert.match(out, /7 skipped/);
  assert.doesNotMatch(out, /[1-9]\d* added/);
});

test('append mode: existing AGENTS.md gets caveman appended (not replaced)', (tmp) => {
  fs.writeFileSync(path.join(tmp, 'AGENTS.md'), '# My project\n\nDo not delete me.\n');
  runInit(tmp);
  const agents = fs.readFileSync(path.join(tmp, 'AGENTS.md'), 'utf8');
  assert.match(agents, /Do not delete me/);
  assert.match(agents, /Speak in the transatlantic register/);
});

test('skip mode: existing .cursor rule is not overwritten without --force', (tmp) => {
  const dir = path.join(tmp, '.cursor/rules');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'caveman.mdc'), '# original\nDo not delete me.\n');
  const out = runInit(tmp);
  assert.match(out, /\? .*\.cursor\/rules\/caveman\.mdc/);
  const after = fs.readFileSync(path.join(dir, 'caveman.mdc'), 'utf8');
  assert.strictEqual(after, '# original\nDo not delete me.\n');
});

test('--force overwrites existing rule files', (tmp) => {
  const dir = path.join(tmp, '.cursor/rules');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'caveman.mdc'), '# original\n');
  runInit(tmp, '--force');
  const after = fs.readFileSync(path.join(dir, 'caveman.mdc'), 'utf8');
  assert.match(after, /alwaysApply: true/);
  assert.match(after, /Speak in the transatlantic/);
});

test('--dry-run: announces but writes nothing', (tmp) => {
  const out = runInit(tmp, '--dry-run');
  assert.match(out, /\(dry run\)/);
  assert.match(out, /6 added/);
  assert.ok(!fs.existsSync(path.join(tmp, '.cursor')));
  assert.ok(!fs.existsSync(path.join(tmp, '.windsurf')));
  assert.ok(!fs.existsSync(path.join(tmp, '.clinerules')));
  assert.ok(!fs.existsSync(path.join(tmp, '.github/copilot-instructions.md')));
  assert.ok(!fs.existsSync(path.join(tmp, '.opencode')));
  assert.ok(!fs.existsSync(path.join(tmp, 'AGENTS.md')));
});

test('--only filters to one target', (tmp) => {
  const out = runInit(tmp, '--only', 'cline');
  assert.match(out, /1 added/);
  assert.ok(fs.existsSync(path.join(tmp, '.clinerules/caveman.md')));
  assert.ok(!fs.existsSync(path.join(tmp, '.cursor')));
});

test('detects sentinel and skips files that already have transatlantic content', (tmp) => {
  // Hand-write a file that already contains the rule (simulating prior install).
  const dir = path.join(tmp, '.clinerules');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'caveman.md'),
    '# Existing\n\nSpeak in the transatlantic register. Hello.\n');
  const out = runInit(tmp, '--only', 'cline');
  assert.match(out, /skipped-already-installed/);
});

test('upgrades a byte-intact legacy caveman install in place', (tmp) => {
  const { LEGACY_RULE_BODY, SENTINEL } = require('../src/tools/caveman-init.js');
  const dir = path.join(tmp, '.clinerules');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'caveman.md');
  fs.writeFileSync(file, '# Prefix kept\n\n' + LEGACY_RULE_BODY);
  const out = runInit(tmp, '--only', 'cline');
  assert.match(out, /upgraded/);
  const after = fs.readFileSync(file, 'utf8');
  assert.ok(after.includes(SENTINEL), 'new ruleset present after upgrade');
  assert.ok(after.startsWith('# Prefix kept'), 'surrounding content preserved');
  assert.ok(!after.includes('Respond terse like smart caveman'), 'old body gone');
});

test('edited legacy install is left alone without --force', (tmp) => {
  const dir = path.join(tmp, '.clinerules');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'caveman.md'),
    '# Existing\n\nRespond terse like smart caveman. Hand-edited rules.\n');
  const out = runInit(tmp, '--only', 'cline');
  assert.match(out, /skipped-legacy-edited/);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
