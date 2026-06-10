// =========================================================================
// 1. TEXT SCRAMBLE EFFECT
// =========================================================================
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 12);
      const end = start + Math.floor(Math.random() * 12);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// =========================================================================
// 2. NAVIGATION & INTERACTION LOGIC
// =========================================================================
function initNavigationAndInteractions() {
  const nav = document.getElementById('mainNav');
  const links = document.querySelectorAll('#navLinks a[data-section]');
  const sects = Array.from(links).map(a => document.getElementById(a.dataset.section));
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navLinks');
  const cursor = document.getElementById('customCursor');
  const dot = document.getElementById('customCursorDot');
  const ring = document.getElementById('customCursorRing');
  const progress = document.getElementById('scrollProgress');

  if (cursor && dot && ring) {
    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });

    function updateCursorAnimation() {
      dotX = mouseX;
      dotY = mouseY;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      requestAnimationFrame(updateCursorAnimation);
    }
    requestAnimationFrame(updateCursorAnimation);
  }

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (window.scrollY / totalHeight) * 100 + '%';
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);

    let cur = '';
    sects.forEach((s, i) => {
      if (s && s.offsetHeight > 0 && s.getBoundingClientRect().top <= 100) cur = links[i].dataset.section;
    });
    links.forEach(a => a.classList.toggle('active', a.dataset.section === cur));

    if (cur && window.lastSection !== cur) {
      window.logAction?.(`VIEWPORT_SECTION: ${cur.toUpperCase()}`);
      window.lastSection = cur;
    }
  }, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
    });
    links.forEach(link => link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    }));
  }

  document.querySelectorAll('a, button, .project-card, .cert-card, .clickable-tag, .nav-toggle').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor?.classList.add('hovering');
      const name = el.querySelector('.project-name, .cert-name')?.textContent || el.textContent;
      if (el.classList.contains('project-card') || el.classList.contains('cert-card')) {
        window.logAction?.(`FOCUS_CELL: ${name.trim().toUpperCase()}`);
      }
    });
    el.addEventListener('mouseleave', () => cursor?.classList.remove('hovering'));
  });

  // Scroll Reveal Observer
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal, .stagger, #skillsGrid').forEach(el => io.observe(el));

  // Set Dark Theme
  document.documentElement.setAttribute('data-theme', 'dark');
}

// =========================================================================
// 3. MAIN INITIALIZATION & TERMINAL EMULATOR
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation and interactions
  initNavigationAndInteractions();

  // Title scramble on load
  const titleEl = document.querySelector('.init-title');
  if (titleEl) {
    const fx = new TextScramble(titleEl);
    fx.setText('Saket Sankhla');
  }

  // Reusable terminal boot sequence
  function startTerminalBoot(terminalId) {
    const terminal = document.getElementById(terminalId);
    if (!terminal) return;

    // Clear loading placeholder or previous runs
    terminal.innerHTML = '';

    const BOOT_LINES = [
      'B.Tech ECE Undergraduate | Digital VLSI',
      'Projects: APB-AHB Bridge · JARVIS · Theft Detector',
      'Open to '
    ];

    const TYPE_SPEED  = 12;   // ms per character
    const LINE_DELAY  = 180;  // ms pause between lines

    const lineEls = BOOT_LINES.map(() => {
      const lineEl  = document.createElement('div');
      lineEl.className = 'terminal-line';
      lineEl.style.display = 'none'; // Hide initially
      const prompt  = document.createElement('span');
      prompt.className = 'terminal-prompt';
      prompt.textContent = '>';
      const content = document.createElement('span');
      content.className = 'terminal-content';
      const cursor  = document.createElement('span');
      cursor.className = 'terminal-cursor';
      cursor.textContent = '\u2588';
      cursor.style.opacity = '0';
      lineEl.append(prompt, content, cursor);
      terminal.appendChild(lineEl);
      return { lineEl, content, cursor };
    });

    function typeLine(index, onDone) {
      const { lineEl, content, cursor } = lineEls[index];
      const text = BOOT_LINES[index];
      
      lineEl.style.display = 'flex'; // Show when typing starts
      cursor.style.opacity = '1';
      
      let i = 0;
      (function type() {
        if (i < text.length) {
          content.textContent += text[i++];
          setTimeout(type, TYPE_SPEED);
        } else {
          // Keep last cursor blinking forever
          if (index < BOOT_LINES.length - 1) {
            cursor.classList.add('done');
          }
          if (onDone) setTimeout(onDone, LINE_DELAY);
        }
      })();
    }

    function runBoot(index) {
      if (index >= BOOT_LINES.length) return;
      const isLast = (index === BOOT_LINES.length - 1);
      typeLine(index, isLast ? null : () => runBoot(index + 1));
    }

    runBoot(0);
  }

  // Initialize both terminals if present
  startTerminalBoot('heroTerminal');
  startTerminalBoot('sidebarTerminal');

  // Decrypt/deobfuscate email addresses
  document.querySelectorAll('.contact-email').forEach(el => {
    const user = el.getAttribute('data-user');
    const domain = el.getAttribute('data-domain');
    if (user && domain) {
      const email = `${user}@${domain}`;
      el.setAttribute('href', `mailto:${email}`);
      const handle = el.querySelector('.link-handle');
      if (handle) {
        handle.textContent = email;
      }
    }
  });
});

// =========================================================================
// 4. LIGHTBOX LIGHT-WEIGHT MODAL LOGIC
// =========================================================================
function openLightbox(src, caption) {
  const lightbox = document.getElementById('certLightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  if (lightbox && img && cap) {
    img.src = src;
    cap.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable background scroll
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('certLightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scroll
  }
}

