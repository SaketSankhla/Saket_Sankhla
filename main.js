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
        output += `<span style="color: #76b900">${char}</span>`;
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
// 2. TOAST SYSTEM
// =========================================================================
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-terminal"></i> <span>${message}</span>`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// =========================================================================
// 3. THREE.JS PARTICLE BACKGROUND
// =========================================================================
function initThreeParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles Geometry
  const particlesCount = 80;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);
  const velocities = [];

  for (let i = 0; i < particlesCount * 3; i += 3) {
    // X, Y, Z
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 5;

    velocities.push({
      x: (Math.random() - 0.5) * 0.005,
      y: (Math.random() - 0.5) * 0.005,
      z: (Math.random() - 0.5) * 0.002
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Particle Material
  const material = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x76b900,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Resize handler
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    const positionsArray = geometry.attributes.position.array;

    for (let i = 0; i < particlesCount; i++) {
      const idx = i * 3;

      // Update positions by velocity
      positionsArray[idx] += velocities[i].x;
      positionsArray[idx + 1] += velocities[i].y;
      positionsArray[idx + 2] += velocities[i].z;

      // Bounce/recycle limits
      if (Math.abs(positionsArray[idx]) > 5) velocities[i].x *= -1;
      if (Math.abs(positionsArray[idx + 1]) > 5) velocities[i].y *= -1;
      if (Math.abs(positionsArray[idx + 2]) > 5) velocities[i].z *= -1;
    }

    geometry.attributes.position.needsUpdate = true;
    points.rotation.y += 0.0008;
    points.rotation.x += 0.0004;

    renderer.render(scene, camera);
  }

  animate();
}

// =========================================================================
// 4. SPA NAVIGATION
// =========================================================================
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link');
  let targetPage = document.getElementById(`page-${pageId}`);

  if (!targetPage) return;

  // Deactivate all pages
  pages.forEach(p => {
    p.classList.remove('visible');
    setTimeout(() => {
      if (!p.classList.contains('visible')) {
        p.classList.remove('active');
      }
    }, 400);
  });

  // Activate target page
  targetPage.classList.add('active');
  setTimeout(() => {
    targetPage.classList.add('visible');
  }, 50);

  // Update nav active classes
  navLinks.forEach(link => {
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Scroll to top of viewport
  window.scrollTo({ top: 0 });
  
  // Log navigation to toast as interactive feedback
  showToast(`ACCESS_SEC: ${pageId.toUpperCase()}`);
}

// =========================================================================
// 5. CUSTOM CURSOR INTEGRATION
// =========================================================================
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let dotX = -100, dotY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    dotX = mouseX;
    dotY = mouseY;
    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;

    // Ring lags behind dot for a beautiful dynamic effect
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  // Add Hovering Class
  const hoverables = 'a, button, .project-card, .cert-card, .nav-logo, .hamburger, .scroll-hint';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverables)) {
      document.body.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverables)) {
      document.body.classList.remove('hovering');
    }
  });
}

// =========================================================================
// 6. TERMINAL WRITER (BOOT SEQUENCE)
// =========================================================================
function runTerminalBoot() {
  const terminal = document.getElementById('heroTerminal');
  if (!terminal) return;

  terminal.innerHTML = '';

  const BOOT_LINES = [
    'Initializing Saket_Sankhla_Profile...',
    'Loading Digital VLSI & RTL design core...',
    'Establishing AMBA APB-AHB bus protocols bridge...',
    'Deploying lookup scheduler elevator controller...',
    'System ready. Access granted.'
  ];

  const TYPE_SPEED = 18; 
  const LINE_DELAY = 220;

  const lineEls = BOOT_LINES.map(() => {
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal-line';
    lineEl.style.display = 'none';
    
    const prompt = document.createElement('span');
    prompt.className = 'terminal-prompt';
    prompt.textContent = '>';
    
    const content = document.createElement('span');
    content.className = 'terminal-content';
    
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    cursor.textContent = '█';
    cursor.style.display = 'none';

    lineEl.append(prompt, content, cursor);
    terminal.appendChild(lineEl);
    return { lineEl, content, cursor };
  });

  function typeLine(index, callback) {
    const { lineEl, content, cursor } = lineEls[index];
    const text = BOOT_LINES[index];

    lineEl.style.display = 'flex';
    cursor.style.display = 'inline-block';

    let charIdx = 0;
    function type() {
      if (charIdx < text.length) {
        content.textContent += text[charIdx++];
        setTimeout(type, TYPE_SPEED);
      } else {
        cursor.style.display = 'none';
        if (callback) setTimeout(callback, LINE_DELAY);
      }
    }
    type();
  }

  function run(idx) {
    if (idx < BOOT_LINES.length) {
      typeLine(idx, () => run(idx + 1));
    } else {
      // Keep last prompt with a blinking cursor
      const lastLine = lineEls[BOOT_LINES.length - 1];
      if (lastLine) {
        lastLine.cursor.style.display = 'inline-block';
      }
    }
  }

  run(0);
}

// =========================================================================
// 7. INITIALIZATION
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Navigation Event Listeners
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.getAttribute('data-page');
      showPage(pageId);
      
      // Close hamburger menu if open
      const navLinks = document.getElementById('navLinks');
      const hamburger = document.getElementById('hamburger');
      if (navLinks && navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
        hamburger.classList.remove('active');
      }
    });
  });

  // Generic target page triggers (for buttons on home page, etc.)
  document.addEventListener('click', e => {
    const targetLink = e.target.closest('[data-target-page]');
    if (targetLink) {
      e.preventDefault();
      const pageId = targetLink.getAttribute('data-target-page');
      showPage(pageId);
    }
  });

  // Mobile Hamburger Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
    });
  }

  // Logo redirects to Home
  const logo = document.getElementById('navLogo');
  if (logo) {
    logo.addEventListener('click', () => showPage('home'));
  }

  // Scroll Progress Bar calculation
  window.addEventListener('scroll', () => {
    const progress = document.getElementById('scrollProgress');
    if (!progress) return;
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progress.style.width = `${scrollPercent}%`;
  });

  // Deobfuscate emails
  document.querySelectorAll('.contact-email').forEach(el => {
    const user = el.getAttribute('data-user');
    const domain = el.getAttribute('data-domain');
    if (user && domain) {
      const email = `${user}@${domain}`;
      el.setAttribute('href', `mailto:${email}`);
      const handle = el.querySelector('.link-handle');
      if (handle) handle.textContent = email;
    }
  });

  // Title Scramble Effect
  const titleEl = document.getElementById('heroTitle');
  if (titleEl) {
    const scramble = new TextScramble(titleEl);
    scramble.setText('Saket Sankhla');
  }

  // Core Features Init
  initCustomCursor();
  initThreeParticles();
  runTerminalBoot();
  
  // Show welcome toast
  setTimeout(() => showToast('SYSTEM ONLINE — SAKET SANKHLA PORTFOLIO'), 800);
});

// =========================================================================
// 8. LIGHTBOX GALLERY
// =========================================================================
window.openLightbox = function(src, caption) {
  const lightbox = document.getElementById('certLightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  if (lightbox && img && cap) {
    img.src = src;
    cap.textContent = caption;
    lightbox.classList.add('active');
  }
};

window.closeLightbox = function() {
  const lightbox = document.getElementById('certLightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
};
