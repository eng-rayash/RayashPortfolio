/**
 * easter-egg.js — Developer Terminal Easter Egg
 * Triggered by: pressing ` (backtick), typing "dev", or Konami code
 * Full interactive terminal with commands
 */

const COMMANDS = {
  help: {
    desc: 'Show available commands',
    run: () => [
      { type: 'info',    text: '╔══════════════════════════════════╗' },
      { type: 'info',    text: '║   RAYASH.DEV TERMINAL v1.0.0     ║' },
      { type: 'info',    text: '╚══════════════════════════════════╝' },
      { type: 'out',     text: '' },
      { type: 'success', text: 'Available commands:' },
      { type: 'out',     text: '  about       — Who is Rayash?' },
      { type: 'out',     text: '  skills      — Tech stack list' },
      { type: 'out',     text: '  contact     — Get in touch' },
      { type: 'out',     text: '  projects    — List all projects' },
      { type: 'out',     text: '  social      — Social media links' },
      { type: 'out',     text: '  quote       — Random dev quote' },
      { type: 'out',     text: '  matrix      — Enter the matrix' },
      { type: 'out',     text: '  clear       — Clear terminal' },
      { type: 'out',     text: '  exit        — Close terminal' },
    ],
  },
  about: {
    desc: 'Who is Rayash?',
    run: () => [
      { type: 'info',    text: '▸ Rayash Faisal Albureihi' },
      { type: 'out',     text: '  Role    : Software Engineer & UI/UX Designer' },
      { type: 'out',     text: '  Uni     : University of Dhamar, IT Engineering' },
      { type: 'out',     text: '  Grad    : 2026 (expected)' },
      { type: 'out',     text: '  Focus   : AI, Automation, Digital Products' },
      { type: 'success', text: '  Status  : AVAILABLE FOR PROJECTS ✓' },
    ],
  },
  skills: {
    desc: 'Tech stack',
    run: () => [
      { type: 'info',    text: '▸ Tech Stack' },
      { type: 'success', text: '  Frontend  : React, Next.js, TypeScript, Three.js' },
      { type: 'success', text: '  Backend   : Node.js, PostgreSQL, Prisma, Redis' },
      { type: 'success', text: '  Mobile    : Flutter & Dart' },
      { type: 'success', text: '  Design    : Figma, UI/UX, Brand Identity' },
      { type: 'success', text: '  DevOps    : Git, Docker, Vercel' },
      { type: 'info',    text: '  3D/Anim   : Three.js, GSAP, Blender' },
    ],
  },
  projects: {
    desc: 'List projects',
    run: () => [
      { type: 'info',    text: '▸ Selected Projects' },
      { type: 'out',     text: '' },
      { type: 'success', text: '  [PRJ.01] Madar & Afaq Co.' },
      { type: 'out',     text: '           Investment & Real Estate Website' },
      { type: 'out',     text: '           → UI/UX + Web Dev + Brand' },
      { type: 'out',     text: '' },
      { type: 'success', text: '  [PRJ.02] Ittihad Al-Bina Contracting' },
      { type: 'out',     text: '           Corporate Contracting Website' },
      { type: 'out',     text: '           → UI/UX + Front-End' },
      { type: 'out',     text: '' },
      { type: 'success', text: '  [PRJ.03] Mudiri — مديري' },
      { type: 'out',     text: '           Smart Admin System (Flutter)' },
      { type: 'out',     text: '           → Product Design + System Architecture' },
    ],
  },
  contact: {
    desc: 'Contact info',
    run: () => [
      { type: 'info',    text: '▸ Contact Information' },
      { type: 'success', text: '  WhatsApp : +967 739 008 083' },
      { type: 'out',     text: '  LinkedIn  : linkedin.com/in/rayash-albureihi-0ba32a404' },
      { type: 'out',     text: '  Facebook  : facebook.com/share/1DEGrFsvGi/' },
      { type: 'out',     text: '  Instagram : @0xo_0o' },
    ],
  },
  social: {
    desc: 'Social links',
    run: () => [
      { type: 'info',    text: '▸ Social Media' },
      { type: 'out',     text: '  → LinkedIn   : /in/rayash-albureihi-0ba32a404' },
      { type: 'out',     text: '  → Facebook   : /share/1DEGrFsvGi/' },
      { type: 'out',     text: '  → Instagram  : @0xo_0o' },
      { type: 'out',     text: '  → WhatsApp   : wa.me/967739008083' },
    ],
  },
  quote: {
    desc: 'Random dev quote',
    run: () => {
      const quotes = [
        '"Code is poetry." — WordPress',
        '"First, solve the problem. Then, write the code." — John Johnson',
        '"Clean code always looks like it was written by someone who cares." — Robert C. Martin',
        '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
        '"The best code is no code at all." — Jeff Atwood',
        '"Design is not just what it looks like. Design is how it works." — Steve Jobs',
        '"Programs must be written for people to read, and only incidentally for machines to execute." — Harold Abelson',
      ];
      const q = quotes[Math.floor(Math.random() * quotes.length)];
      return [
        { type: 'out',  text: '' },
        { type: 'info', text: q },
        { type: 'out',  text: '' },
      ];
    },
  },
  matrix: {
    desc: 'Enter the matrix',
    run: () => {
      const chars = '01アイウエオカキクケコサシスセソタチツテト';
      const rows = [];
      for (let i = 0; i < 4; i++) {
        let row = '  ';
        for (let j = 0; j < 42; j++) {
          row += chars[Math.floor(Math.random() * chars.length)];
        }
        rows.push({ type: 'success', text: row });
      }
      rows.push({ type: 'info', text: '  Wake up, Rayash. The Matrix has you...' });
      return rows;
    },
  },
  whoami: {
    desc: 'Who am I?',
    run: () => [
      { type: 'success', text: 'rayash@albureihi' },
      { type: 'out',     text: 'Software Engineer · UI/UX Designer · Builder' },
    ],
  },
  clear: {
    desc: 'Clear terminal',
    run: () => '__clear__',
  },
  exit: {
    desc: 'Close terminal',
    run: () => '__exit__',
  },
};

const WELCOME_LINES = [
  { type: 'info',    text: '  ____   ___   __ __ ___   ___  _  _ ' },
  { type: 'info',    text: ' |  _ \\ / _ \\ |  V  | __| / __|  \\| |' },
  { type: 'info',    text: ' | |_/ / (_) || |\\/| | _|  \\__ \\ | ` |' },
  { type: 'info',    text: ' |____/ \\___/ |_|  |_|___| |___/_|\\__|' },
  { type: 'out',     text: '' },
  { type: 'success', text: '  Welcome to Rayash\'s Developer Terminal v1.0.0' },
  { type: 'out',     text: '  Type "help" to see available commands.' },
  { type: 'out',     text: '' },
];

export function initEasterEgg() {
  const terminal   = document.getElementById('terminal');
  const body       = document.getElementById('terminal-body');
  const input      = document.getElementById('terminal-input');
  const closeBtn   = document.getElementById('terminal-close');
  const hint       = document.querySelector('[data-terminal-hint]');

  if (!terminal || !body || !input) return;

  let isOpen = false;
  let inputBuffer = '';
  const TRIGGER_WORD = 'dev';
  const history = [];
  let histIdx = -1;

  // --- Open/Close ---
  function open() {
    isOpen = true;
    terminal.classList.add('open');
    terminal.setAttribute('aria-hidden', 'false');
    setTimeout(() => input.focus(), 400);
    if (body.children.length === 0) printWelcome();
  }

  function close() {
    isOpen = false;
    terminal.classList.remove('open');
    terminal.setAttribute('aria-hidden', 'true');
    input.value = '';
    inputBuffer = '';
  }

  function toggle() { isOpen ? close() : open(); }

  // --- Print utilities ---
  function printLine(content) {
    const div = document.createElement('div');
    div.className = `t-line ${content.type || 'out'}`;
    div.textContent = content.text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function printLines(lines) {
    lines.forEach((l, i) => setTimeout(() => printLine(l), i * 28));
  }

  function printWelcome() {
    printLines(WELCOME_LINES);
  }

  function printCommand(cmd) {
    printLine({ type: 'cmd', text: `$ ${cmd}` });
  }

  function clearTerminal() {
    body.innerHTML = '';
  }

  // --- Command runner ---
  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    history.unshift(cmd);
    histIdx = -1;

    printCommand(cmd);

    if (!COMMANDS[cmd]) {
      printLine({ type: 'error', text: `Command not found: "${cmd}". Type "help".` });
      return;
    }

    const result = COMMANDS[cmd].run();
    if (result === '__clear__') { clearTerminal(); return; }
    if (result === '__exit__')  { close(); return; }
    printLines(result);
  }

  // --- Input handler ---
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runCommand(input.value);
      input.value = '';
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history[histIdx + 1]) { histIdx++; input.value = history[histIdx]; }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; input.value = history[histIdx]; }
      else { histIdx = -1; input.value = ''; }
    }
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.value.toLowerCase();
      const match = Object.keys(COMMANDS).find((c) => c.startsWith(partial));
      if (match) input.value = match;
    }
  });

  // --- Close button ---
  if (closeBtn) closeBtn.addEventListener('click', close);

  // --- Backdrop click ---
  terminal.addEventListener('click', (e) => { if (e.target === terminal) close(); });

  // --- Keyboard triggers ---
  document.addEventListener('keydown', (e) => {
    // Backtick to toggle
    if (e.key === '`' && !e.ctrlKey && !e.metaKey) {
      if (!isOpen) open(); else close();
      return;
    }
    // Escape to close
    if (e.key === 'Escape' && isOpen) { close(); return; }

    // Typing "dev" anywhere outside input to open
    if (!isOpen && document.activeElement !== input) {
      if (e.key.length === 1) {
        inputBuffer += e.key.toLowerCase();
        if (inputBuffer.length > TRIGGER_WORD.length) {
          inputBuffer = inputBuffer.slice(-TRIGGER_WORD.length);
        }
        if (inputBuffer === TRIGGER_WORD) { open(); inputBuffer = ''; }
      }
    }
  });

  // --- Hint click ---
  if (hint) hint.addEventListener('click', toggle);

  // --- Konami code easter egg within terminal ---
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIdx = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0;
        open();
        setTimeout(() => {
          printLine({ type: 'success', text: '🎮 KONAMI CODE ACTIVATED! +30 lives' });
          printLine({ type: 'info',    text: 'You found the secret. Rayash is proud of you.' });
        }, 300);
      }
    } else { konamiIdx = 0; }
  });
}
