#!/usr/bin/env node
// caveman — shared configuration resolver
//
// Resolution order for default mode:
//   1. CAVEMAN_DEFAULT_MODE environment variable
//   2. Repo-local config (checked-in, per-project default):
//      - <cwd>/.caveman/config.json
//      - <cwd>/.caveman.json
//      Walks up from process.cwd() to the nearest ancestor containing one of
//      these (stops at filesystem root). Lets a team pin a project's default
//      mode without polluting every contributor's user-level config or env.
//   3. User config file defaultMode field:
//      - $XDG_CONFIG_HOME/caveman/config.json (any platform, if set)
//      - ~/.config/caveman/config.json (macOS / Linux fallback)
//      - %APPDATA%\caveman\config.json (Windows fallback)
//   4. 'full'

const fs = require('fs');
const path = require('path');
const os = require('os');

const VALID_MODES = [
  'off',
  // Transatlantic ladder — most readable to most compressed
  // (research basis: docs/research/level-ladder.md)
  'liner', 'plain', 'transatlantic', 'aviation', 'telegraph', 'morse',
  // Wenyan annex — classical Chinese registers, kept as first-class levels
  // ('wenyan' is the canonical spelling of wenyan-full, as upstream)
  'wenyan-lite', 'wenyan', 'wenyan-full', 'wenyan-ultra',
  // Legacy caveman names — accepted on read/args, normalized before write
  'lite', 'full', 'ultra',
  // Independent one-shot skill modes
  'commit', 'review', 'compress'
];

// Legacy name → canonical level. Old flag files, configs, and /caveman args
// keep working; everything is normalized before it is written or acted on.
const LEGACY_ALIASES = {
  lite: 'transatlantic',
  full: 'telegraph',
  ultra: 'morse',
  'wenyan-full': 'wenyan'
};

function normalizeMode(mode) {
  if (!mode) return null;
  const m = String(mode).toLowerCase();
  if (!VALID_MODES.includes(m)) return null;
  return LEGACY_ALIASES[m] || m;
}

function getConfigBase() {
  if (process.env.XDG_CONFIG_HOME) {
    return process.env.XDG_CONFIG_HOME;
  }
  if (process.platform === 'win32') {
    return process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  }
  return path.join(os.homedir(), '.config');
}

// Primary name first, legacy fallback second. getConfigDir() keeps returning
// the legacy dir when only it exists so existing user configs keep working.
function getConfigDir() {
  const primary = path.join(getConfigBase(), 'transatlantic');
  const legacy = path.join(getConfigBase(), 'caveman');
  try {
    if (fs.existsSync(path.join(primary, 'config.json'))) return primary;
    if (fs.existsSync(path.join(legacy, 'config.json'))) return legacy;
  } catch (e) { /* fall through */ }
  return primary;
}

function getConfigPath() {
  return path.join(getConfigDir(), 'config.json');
}

// Walk up from `start` looking for a repo-local caveman config. Returns the
// absolute path of the first match, or null. Stops at the filesystem root.
// Candidates per dir (first wins): .caveman/config.json, .caveman.json.
//
// Bounded to 64 levels to defend against symlink cycles on pathological mounts.
function findRepoConfigPath(start) {
  try {
    let dir = path.resolve(start || process.cwd());
    const candidates = [
      '.transatlantic/config.json', '.transatlantic.json',
      '.caveman/config.json', '.caveman.json' // legacy
    ];
    for (let i = 0; i < 64; i++) {
      for (const rel of candidates) {
        const p = path.join(dir, rel);
        try {
          const st = fs.lstatSync(p);
          // Refuse symlinks — symmetric with safeWriteFlag/readFlag policy.
          if (st.isSymbolicLink() || !st.isFile()) continue;
          return p;
        } catch (e) {
          // not present, try next candidate
        }
      }
      const parent = path.dirname(dir);
      if (parent === dir) return null;
      dir = parent;
    }
  } catch (e) {
    // Defensive: any cwd / fs failure → no repo config
  }
  return null;
}

function readModeFromConfigFile(configPath) {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(raw);
    if (config && config.defaultMode) {
      return normalizeMode(config.defaultMode);
    }
  } catch (e) {
    // Missing / unreadable / invalid JSON → caller falls through
  }
  return null;
}

function getDefaultMode() {
  // 1. Environment variable (highest priority). TRANSATLANTIC_DEFAULT_MODE is
  // the primary name; CAVEMAN_DEFAULT_MODE stays accepted as a legacy alias.
  const envMode = normalizeMode(process.env.TRANSATLANTIC_DEFAULT_MODE) ||
    normalizeMode(process.env.CAVEMAN_DEFAULT_MODE);
  if (envMode) {
    return envMode;
  }

  // 2. Repo-local config (checked-in, per-project default)
  const repoConfigPath = findRepoConfigPath(process.cwd());
  if (repoConfigPath) {
    const repoMode = readModeFromConfigFile(repoConfigPath);
    if (repoMode) return repoMode;
  }

  // 3. User config file
  const userMode = readModeFromConfigFile(getConfigPath());
  if (userMode) return userMode;

  // 4. Default
  return 'transatlantic';
}

// Symlink-safe flag file write.
// Uses O_NOFOLLOW where available, writes atomically via temp + rename with
// 0600 permissions. Protects against local attackers replacing the predictable
// flag path (~/.claude/.ta-active) with a symlink to clobber other files.
//
// When the parent directory is itself a symlink (legitimate pattern: ~/.claude
// symlinked to another drive or shared config dir), resolves through to the
// real path and verifies ownership on Unix (uid match). This allows e.g.
//   ln -s /opt/shared-claude-config ~/.claude
// while still refusing attacker-planted symlinks pointing to dirs owned by
// another user.
//
// On Windows, uid checks are unavailable — falls back to verifying the resolved
// path lives under the user's home directory.
//
// The flag file itself must never be a symlink (that's the actual clobber vector).
//
// Set TA_DEBUG=1 (legacy CAVEMAN_DEBUG=1) to emit stderr diagnostics when flag writes are refused.
//
// Silent-fails on any filesystem error — the flag is best-effort.
function safeWriteFlag(flagPath, content) {
  const debug = process.env.TA_DEBUG === '1' || process.env.CAVEMAN_DEBUG === '1';
  try {
    const flagDir = path.dirname(flagPath);
    fs.mkdirSync(flagDir, { recursive: true });

    // When the parent directory is a symlink, resolve it and verify ownership.
    // This allows legitimate symlinked ~/.claude dirs while still refusing
    // attacker-planted symlinks pointing at dirs owned by another user.
    let realFlagDir;
    try {
      const lstat = fs.lstatSync(flagDir);
      if (lstat.isSymbolicLink()) {
        realFlagDir = fs.realpathSync(flagDir);
        const realStat = fs.statSync(realFlagDir);
        if (!realStat.isDirectory()) {
          if (debug) process.stderr.write(`[caveman] safeWriteFlag: symlink target ${realFlagDir} is not a directory\n`);
          return;
        }
        if (typeof process.getuid === 'function') {
          if (realStat.uid !== process.getuid()) {
            if (debug) process.stderr.write(`[caveman] safeWriteFlag: symlink target ${realFlagDir} owned by uid ${realStat.uid}, not current user ${process.getuid()}\n`);
            return;
          }
        } else {
          const home = os.homedir();
          const normalizedReal = path.resolve(realFlagDir);
          const normalizedHome = path.resolve(home);
          if (!normalizedReal.toLowerCase().startsWith(normalizedHome.toLowerCase() + path.sep) &&
              normalizedReal.toLowerCase() !== normalizedHome.toLowerCase()) {
            if (debug) process.stderr.write(`[caveman] safeWriteFlag: symlink target ${normalizedReal} is outside home directory ${normalizedHome}\n`);
            return;
          }
        }
      } else {
        realFlagDir = flagDir;
      }
    } catch (e) {
      return;
    }

    // The flag file itself must never be a symlink (that's the actual clobber vector).
    const realFlagPath = path.join(realFlagDir, path.basename(flagPath));
    try {
      if (fs.lstatSync(realFlagPath).isSymbolicLink()) return;
    } catch (e) {
      if (e.code !== 'ENOENT') return;
    }

    const tempPath = path.join(realFlagDir, `.ta-active.${process.pid}.${Date.now()}`);
    const O_NOFOLLOW = typeof fs.constants.O_NOFOLLOW === 'number' ? fs.constants.O_NOFOLLOW : 0;
    const flags = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | O_NOFOLLOW;
    let fd;
    try {
      fd = fs.openSync(tempPath, flags, 0o600);
      fs.writeSync(fd, String(content));
      try { fs.fchmodSync(fd, 0o600); } catch (e) { /* best-effort on Windows */ }
    } finally {
      if (fd !== undefined) fs.closeSync(fd);
    }
    fs.renameSync(tempPath, realFlagPath);
  } catch (e) {
    // Silent fail — flag is best-effort
  }
}

// Symlink-safe, size-capped, whitelist-validated flag file read.
// Symmetric with safeWriteFlag: refuses symlinks at the target, caps the read,
// and rejects anything that isn't a known mode. Returns null on any anomaly.
//
// Without this, a local attacker with write access to ~/.claude/ could replace
// the flag with a symlink to ~/.ssh/id_rsa (or any user-readable secret). Every
// reader — statusline, per-turn reinforcement — would slurp that content and
// either echo it to the terminal or inject it into model context.
//
// MAX_FLAG_BYTES is a hard cap. The longest legitimate value is
// "transatlantic" (13 bytes); 64 leaves slack without enabling exfil.
const MAX_FLAG_BYTES = 64;

function readFlag(flagPath) {
  try {
    let st;
    try {
      st = fs.lstatSync(flagPath);
    } catch (e) {
      return null;
    }
    if (st.isSymbolicLink() || !st.isFile()) return null;
    if (st.size > MAX_FLAG_BYTES) return null;

    const O_NOFOLLOW = typeof fs.constants.O_NOFOLLOW === 'number' ? fs.constants.O_NOFOLLOW : 0;
    const flags = fs.constants.O_RDONLY | O_NOFOLLOW;
    let fd;
    let out;
    try {
      fd = fs.openSync(flagPath, flags);
      const buf = Buffer.alloc(MAX_FLAG_BYTES);
      const n = fs.readSync(fd, buf, 0, MAX_FLAG_BYTES, 0);
      out = buf.slice(0, n).toString('utf8');
    } finally {
      if (fd !== undefined) fs.closeSync(fd);
    }

    const raw = out.trim().toLowerCase();
    // Whitelist first, then collapse legacy names so every reader sees only
    // canonical ladder levels even when an old flag file is still on disk.
    return normalizeMode(raw);
  } catch (e) {
    return null;
  }
}

// Symlink-safe append. Same parent-dir + symlink-target rules as safeWriteFlag,
// but opens with O_APPEND so concurrent writers from different sessions don't
// clobber each other. Used for the lifetime stats log
// ($CLAUDE_CONFIG_DIR/.ta-history.jsonl).
//
// Silent-fails on any filesystem error.
function appendFlag(filePath, line) {
  const debug = process.env.TA_DEBUG === '1' || process.env.CAVEMAN_DEBUG === '1';
  try {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });

    let realDir;
    try {
      const lstat = fs.lstatSync(dir);
      if (lstat.isSymbolicLink()) {
        realDir = fs.realpathSync(dir);
        const realStat = fs.statSync(realDir);
        if (!realStat.isDirectory()) return;
        if (typeof process.getuid === 'function') {
          if (realStat.uid !== process.getuid()) {
            if (debug) process.stderr.write(`[caveman] appendFlag: symlink target ${realDir} owned by uid ${realStat.uid}\n`);
            return;
          }
        } else {
          const home = os.homedir();
          const normalized = path.resolve(realDir).toLowerCase();
          const normalizedHome = path.resolve(home).toLowerCase();
          if (!normalized.startsWith(normalizedHome + path.sep) && normalized !== normalizedHome) return;
        }
      } else {
        realDir = dir;
      }
    } catch (e) {
      return;
    }

    const realPath = path.join(realDir, path.basename(filePath));
    try {
      if (fs.lstatSync(realPath).isSymbolicLink()) return;
    } catch (e) {
      if (e.code !== 'ENOENT') return;
    }

    const O_NOFOLLOW = typeof fs.constants.O_NOFOLLOW === 'number' ? fs.constants.O_NOFOLLOW : 0;
    const flags = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_APPEND | O_NOFOLLOW;
    let fd;
    try {
      fd = fs.openSync(realPath, flags, 0o600);
      fs.writeSync(fd, String(line).replace(/\n$/, '') + '\n');
      try { fs.fchmodSync(fd, 0o600); } catch (e) { /* best-effort on Windows */ }
    } finally {
      if (fd !== undefined) fs.closeSync(fd);
    }
  } catch (e) {
    // Silent fail — history is best-effort
  }
}

// Mode-transition log (#601). Whenever the active-mode flag actually changes,
// append {ts, mode, prev} to $CLAUDE_CONFIG_DIR/.ta-mode-log.jsonl so
// caveman-stats can attribute output tokens to the mode that was active when
// each message was generated, instead of whatever mode the flag holds at
// stats time. mode/prev are a VALID_MODES string or null (null = caveman off).
// prev lets stats attribute messages that predate the first logged transition
// of a session. No-op when the mode is unchanged; best-effort like all flag IO.
const MODE_LOG_BASENAME = '.ta-mode-log.jsonl';

function recordModeChange(claudeDir, newMode) {
  try {
    const current = readFlag(path.join(claudeDir, '.ta-active'));
    const next = newMode || null;
    if ((current || null) === next) return;
    appendFlag(
      path.join(claudeDir, MODE_LOG_BASENAME),
      JSON.stringify({ ts: Date.now(), mode: next, prev: current || null })
    );
  } catch (e) {
    // Silent fail — the log is best-effort
  }
}

// Symlink-safe history read. Returns lines (untrimmed) or empty array on any
// anomaly. Caller is responsible for parsing JSON. Does NOT enforce a size cap
// the way readFlag does — history is expected to grow with use.
function readHistory(filePath) {
  try {
    const st = fs.lstatSync(filePath);
    if (st.isSymbolicLink() || !st.isFile()) return [];
    const O_NOFOLLOW = typeof fs.constants.O_NOFOLLOW === 'number' ? fs.constants.O_NOFOLLOW : 0;
    const flags = fs.constants.O_RDONLY | O_NOFOLLOW;
    let fd;
    let raw;
    try {
      fd = fs.openSync(filePath, flags);
      raw = fs.readFileSync(fd, 'utf8');
    } finally {
      if (fd !== undefined) fs.closeSync(fd);
    }
    return raw.split('\n').filter(line => line.trim());
  } catch (e) {
    return [];
  }
}

// One-shot skill modes (own slash commands, not prose levels) — the single
// definition; tracker, activate hook, and the opencode plugin all import it.
const INDEPENDENT_MODES = ['commit', 'review', 'compress'];

// Per-level attention anchor, shared by every per-turn reinforcement emitter.
const REINFORCEMENT = {
  liner: 'Classy humanized prose. Full natural voice, varied sentence rhythm, no machine-writing tells, no filler.',
  plain: 'Plain language. Short declarative sentences, common words, active voice, front-load the point.',
  transatlantic: 'Newsreel voice. Full grammar, one idea per sentence. Cut filler/hedging/pleasantries/padding.',
  aviation: 'Controlled technical English. Sentences max ~20 words, one instruction per sentence, imperative mood, one term one meaning.',
  telegraph: 'Telegraphic register. Drop articles, fragments OK, short synonyms.',
  morse: 'Bare keywords, minimal glue words. State each fact once.'
};

// One-time migration: rename caveman-era state files to their ta-era names.
// Called at SessionStart; best-effort and silent like all flag IO. Never
// overwrites an existing new-name file.
const LEGACY_STATE_FILES = [
  ['.caveman-active', '.ta-active'],
  ['.caveman-active.prev', '.ta-active.prev'],
  ['.caveman-statusline-suffix', '.ta-statusline-suffix'],
  ['.caveman-history.jsonl', '.ta-history.jsonl'],
  ['.caveman-mode-log.jsonl', '.ta-mode-log.jsonl'],
];

function migrateLegacyState(claudeDir) {
  for (const [oldName, newName] of LEGACY_STATE_FILES) {
    try {
      const oldPath = path.join(claudeDir, oldName);
      const newPath = path.join(claudeDir, newName);
      const st = fs.lstatSync(oldPath);
      if (st.isSymbolicLink() || !st.isFile()) continue;
      if (fs.existsSync(newPath)) { fs.unlinkSync(oldPath); continue; }
      fs.renameSync(oldPath, newPath);
    } catch (e) { /* absent or unreadable — nothing to migrate */ }
  }
}

module.exports = { migrateLegacyState, getDefaultMode, getConfigDir, getConfigPath, findRepoConfigPath, VALID_MODES, LEGACY_ALIASES, normalizeMode, INDEPENDENT_MODES, REINFORCEMENT, safeWriteFlag, readFlag, appendFlag, readHistory, recordModeChange, MODE_LOG_BASENAME };
