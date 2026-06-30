// =========================================================================
// 1. TEXT SCRAMBLE EFFECT
// =========================================================================
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\\\/[]{}—=+*^?#________';
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
        output += `<span style="color: #ffffff">${char}</span>`;
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
  toast.innerHTML = `<i class="fa-solid fa-circle"></i> <span>${message}</span>`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// =========================================================================
// 3. THREE.JS PARTICLE BACKGROUND (OPTIMIZED FOR MOBILE THREADS)
// =========================================================================
function initThreeParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Capped pixel ratio for performance

  // Particles Geometry (Reduced count for mobile rendering performance)
  const particlesCount = 30;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);
  const velocities = [];

  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 8;
    positions[i + 1] = (Math.random() - 0.5) * 8;
    positions[i + 2] = (Math.random() - 0.5) * 4;

    velocities.push({
      x: (Math.random() - 0.5) * 0.002,
      y: (Math.random() - 0.5) * 0.002,
      z: (Math.random() - 0.5) * 0.001
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Particle Material
  const material = new THREE.PointsMaterial({
    size: 0.035,
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  function animate() {
    requestAnimationFrame(animate);

    const positionsArray = geometry.attributes.position.array;

    for (let i = 0; i < particlesCount; i++) {
      const idx = i * 3;
      positionsArray[idx] += velocities[i].x;
      positionsArray[idx + 1] += velocities[i].y;
      positionsArray[idx + 2] += velocities[i].z;

      if (Math.abs(positionsArray[idx]) > 4) velocities[i].x *= -1;
      if (Math.abs(positionsArray[idx + 1]) > 4) velocities[i].y *= -1;
      if (Math.abs(positionsArray[idx + 2]) > 3) velocities[i].z *= -1;
    }

    geometry.attributes.position.needsUpdate = true;
    points.rotation.y += 0.0002;
    points.rotation.x += 0.0001;

    renderer.render(scene, camera);
  }

  animate();
}

// =========================================================================
// 4. INITIALIZATION & OBSERVERS
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('#navLinks a');
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  // Navigation Links Click Event (Smooth Scroll and Mobile Drawer Auto-Close)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetSec = document.querySelector(targetId);
        if (targetSec) {
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Auto-close hamburger menu
        if (navLinksContainer && navLinksContainer.classList.contains('mobile-open')) {
          navLinksContainer.classList.remove('mobile-open');
          hamburger.classList.remove('active');
        }
      }
    });
  });

  // Home Page / Contact Page Nothing Menu smooth scrolling
  document.querySelectorAll('.nothing-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const targetId = item.getAttribute('href');
      
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetSec = document.querySelector(targetId);
        if (targetSec) {
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Mobile Hamburger Toggle
  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navLinksContainer.classList.toggle('mobile-open');
    });
    
    // Close mobile drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !hamburger.contains(e.target)) {
        if (navLinksContainer.classList.contains('mobile-open')) {
          navLinksContainer.classList.remove('mobile-open');
          hamburger.classList.remove('active');
        }
      }
    });
  }

  // Logo scrolls to Home
  const logo = document.getElementById('navLogo');
  if (logo) {
    logo.addEventListener('click', () => {
      const homeSec = document.getElementById('home');
      if (homeSec) {
        homeSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Scroll Progress Bar calculation
  window.addEventListener('scroll', () => {
    const progress = document.getElementById('scrollProgress');
    if (!progress) return;
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progress.style.width = `${scrollPercent}%`;
  });

  // ScrollSpy: Update active nav links during scroll
  const sections = document.querySelectorAll('section[id]');
  const scrollSpyOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, scrollSpyOptions);

  sections.forEach(section => scrollSpyObserver.observe(section));

  // IntersectionObserver for scroll-reveal animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -5% 0px',
    threshold: 0.02
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
      }
    });
  }, revealOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // Deobfuscate emails
  document.querySelectorAll('.contact-email').forEach(el => {
    const user = el.getAttribute('data-user');
    const domain = el.getAttribute('data-domain');
    if (user && domain) {
      const email = `${user}@${domain}`;
      
      if (el.tagName === 'A' || el.closest('a')) {
        const linkEl = el.tagName === 'A' ? el : el.closest('a');
        linkEl.setAttribute('href', `mailto:${email}`);
      }
      
      const handle = el.querySelector('.link-handle');
      if (handle) {
        handle.textContent = email;
      } else {
        el.textContent = email;
      }
    }
  });

  // Core Features Init (No Custom Cursor for Mobile)
  initThreeParticles();

  // Show welcome toast
  setTimeout(() => showToast('SYSTEM ONLINE — SAKET SANKHLA PORTFOLIO'), 800);
});

// =========================================================================
// 6. LIGHTBOX GALLERY
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
