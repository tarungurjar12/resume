// ── Initialize AOS Animation Library
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
  disable: false
});

// ── Page Loader
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    // Re-trigger AOS after loader hides
    setTimeout(() => AOS.refresh(), 100);
  }, 1800);
});

// ── Navbar scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

// ── Mobile menu
function openMob() { document.getElementById('mobMenu').classList.add('open'); }
function closeMob() { document.getElementById('mobMenu').classList.remove('open'); }

// ── Active nav pill tracking
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

// ── Magnetic button effect
document.querySelectorAll('.btn-main,.btn-outline,.nav-hire').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ── Counter animation for stats
function animateCounters() {
  document.querySelectorAll('.about-stat-n').forEach(el => {
    const text = el.textContent;
    const match = text.match(/^(\d+)/);
    if (match) {
      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      let current = 0;
      const increment = target / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        const spanMatch = el.innerHTML.match(/<span>.*<\/span>/);
        if (spanMatch) el.innerHTML = Math.floor(current) + spanMatch[0];
        else el.textContent = Math.floor(current) + suffix;
      }, 40);
    }
  });
}
const statsEl = document.querySelector('.about-stats');
if (statsEl) {
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounters(); statsObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  statsObs.observe(statsEl);
}

// ── Experience Timeline Path Animation
const expTimeline = document.getElementById('expTimeline');
if (expTimeline) {
  const expObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        expTimeline.classList.add('path-drawn');
        expObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  expObs.observe(expTimeline);
}

// ── Education Curved Path Animation
const eduPath = document.getElementById('eduPath');
if (eduPath) {
  // Measure the actual path length and set dasharray
  const pathLine = eduPath.querySelector('.edu-path-line');
  if (pathLine) {
    // Wait for SVG to render to get accurate length
    requestAnimationFrame(() => {
      const len = pathLine.getTotalLength();
      pathLine.style.strokeDasharray = len;
      pathLine.style.strokeDashoffset = len;
    });
  }
  const eduObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        eduPath.classList.add('path-drawn');
        eduObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  eduObs.observe(eduPath);
}

// ── Projects Horizontal Scroll — progress thumb tracking
const projScroll = document.getElementById('projScroll');
const projThumb = document.getElementById('projThumb');
if (projScroll && projThumb) {
  projScroll.addEventListener('scroll', () => {
    const maxScroll = projScroll.scrollWidth - projScroll.clientWidth;
    if (maxScroll > 0) {
      const pct = projScroll.scrollLeft / maxScroll;
      projThumb.style.marginLeft = (pct * 70) + '%'; // 70% because thumb is 30% wide
    }
  });
}

// ── Project card tilt effect
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── Parallax fade on hero marquee
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const marquee = document.querySelector('.hero-marquee-bg');
      if (marquee) marquee.style.opacity = Math.max(0, 0.5 - window.scrollY * 0.001);
      ticking = false;
    });
    ticking = true;
  }
});
