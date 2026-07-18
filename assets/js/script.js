'use strict';

/* ── AOS Init ──────────────────────────────────────── */
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});

/* ── Page Loader ────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    setTimeout(() => AOS.refresh(), 100);
  }, 1800);
});

/* ── Scroll Progress Bar ────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar && total > 0) {
    progressBar.style.width = ((scrolled / total) * 100).toFixed(2) + '%';
  }
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* ── Navbar scroll effect ────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile menu ────────────────────────────────────── */
function openMob() { document.getElementById('mobMenu').classList.add('open'); }
function closeMob() { document.getElementById('mobMenu').classList.remove('open'); }

/* ── Active nav pill tracking ────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const pills = document.querySelectorAll('.nav-pill');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      pills.forEach(p => p.classList.remove('active'));
      const match = document.querySelector(`.nav-pill[href="#${e.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.3 });
sections.forEach(s => secObs.observe(s));

/* ── Smooth Anchor Scroll (offset for fixed nav) ────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ══════════════════════════════════════════════════════
   CUSTOM CURSOR (desktop / fine pointer only)
══════════════════════════════════════════════════════ */
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (cursorDot && cursorRing && isFinePointer) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  // Show cursor on first move
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  }, { passive: true });

  // Lagging ring animation
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;
    cursorRing.style.left = ringX.toFixed(2) + 'px';
    cursorRing.style.top  = ringY.toFixed(2) + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover state classes
  const hoverEls = 'a, button, .t-card, .sk-card, .proj-card, .c-soc, .edu-card, .about-stat, [onclick]';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Link state
  document.querySelectorAll('a').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-link'));
  });

  // Hide on leave
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
}

/* ══════════════════════════════════════════════════════
   MOUSE-GLOW — follows cursor inside card
══════════════════════════════════════════════════════ */
function attachMouseGlow(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
      el.style.setProperty('--mx', x);
      el.style.setProperty('--my', y);
    }, { passive: true });
  });
}
attachMouseGlow('.sk-card');
attachMouseGlow('.t-card');
attachMouseGlow('.edu-card');

/* ── Magnetic buttons ────────────────────────────────── */
document.querySelectorAll('.btn-main, .btn-outline, .nav-hire').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width  / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ── Counter animation for stats ─────────────────────── */
function animateCounter(el) {
  const text  = el.textContent;
  const match = text.match(/^(\d+)/);
  if (!match) return;
  const target = parseInt(match[1]);
  const suffix = text.replace(match[1], '');
  let current  = 0;
  const step   = target / 30;
  const timer  = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    const span = el.innerHTML.match(/<span>.*<\/span>/);
    el.innerHTML = span
      ? Math.floor(current) + span[0]
      : Math.floor(current) + suffix;
  }, 40);
}
const statsEl = document.querySelector('.about-stats');
if (statsEl) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      document.querySelectorAll('.about-stat-n').forEach(animateCounter);
    }
  }, { threshold: 0.5 }).observe(statsEl);
}

/* ── Experience Timeline Path Animation ─────────────── */
const expTimeline = document.getElementById('expTimeline');
if (expTimeline) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      expTimeline.classList.add('path-drawn');
    }
  }, { threshold: 0.15 }).observe(expTimeline);
}

/* ── Education Curved Path Animation ────────────────── */
const eduPath = document.getElementById('eduPath');
if (eduPath) {
  const pathLine = eduPath.querySelector('.edu-path-line');
  if (pathLine) {
    requestAnimationFrame(() => {
      const len = pathLine.getTotalLength();
      pathLine.style.strokeDasharray  = len;
      pathLine.style.strokeDashoffset = len;
    });
  }
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      eduPath.classList.add('path-drawn');
    }
  }, { threshold: 0.2 }).observe(eduPath);
}

/* ── Projects Horizontal Scroll Thumb ───────────────── */
const projScroll = document.getElementById('projScroll');
const projThumb  = document.getElementById('projThumb');
if (projScroll && projThumb) {
  projScroll.addEventListener('scroll', () => {
    const max = projScroll.scrollWidth - projScroll.clientWidth;
    if (max > 0) {
      projThumb.style.marginLeft = ((projScroll.scrollLeft / max) * 70) + '%';
    }
  }, { passive: true });
}

/* ── Project Card 3-D Tilt ───────────────────────────── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform =
      `translateY(-8px) perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ══════════════════════════════════════════════════════
   TEXT SCRAMBLE — hover over company names
══════════════════════════════════════════════════════ */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234';
function scramble(el) {
  const orig = el.dataset.original || el.textContent;
  el.dataset.original = orig;
  let iter = 0;
  clearInterval(el._scrambleTimer);
  el._scrambleTimer = setInterval(() => {
    el.textContent = orig.split('').map((ch, i) => {
      if (ch === ' ' || ch === '(' || ch === ')') return ch;
      if (i < iter) return orig[i];
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');
    if (iter >= orig.length) {
      clearInterval(el._scrambleTimer);
      el.textContent = orig;
    }
    iter += 0.6;
  }, 28);
}
document.querySelectorAll('.exp-co, .proj-name').forEach(el => {
  el.addEventListener('mouseenter', () => scramble(el));
  el.addEventListener('mouseleave', () => {
    clearInterval(el._scrambleTimer);
    el.textContent = el.dataset.original || el.textContent;
  });
});

/* ── Parallax — Hero Marquee Fades on Scroll ────────── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const marquee = document.querySelector('.hero-marquee-bg');
      if (marquee) {
        marquee.style.opacity = Math.max(0, 0.5 - window.scrollY * 0.001);
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ── Stagger project cards on scroll ────────────────── */
const projCards = document.querySelectorAll('.proj-card');
new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }, i * 80);
    }
  });
}, { threshold: 0.1 }).observe(document.getElementById('projScroll') || document.body);
