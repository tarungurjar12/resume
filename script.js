// ── Page Loader
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('done'), 1600);
});

// ── Custom cursor
const dot = document.getElementById('curDot');
const ring = document.getElementById('curCircle');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  dot.style.left = mx+'px'; dot.style.top = my+'px';
});
(function trackRing(){
  rx+=(mx-rx)*0.1; ry+=(my-ry)*0.1;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(trackRing);
})();
document.querySelectorAll('a,button,.exp-row,.sk-card,.proj-card,.t-card,.edu-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
});

// ── Navbar
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30));

// ── Mobile menu
function openMob(){ document.getElementById('mobMenu').classList.add('open') }
function closeMob(){ document.getElementById('mobMenu').classList.remove('open') }

// ── Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in') });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.rv').forEach(el => obs.observe(el));

// ── Active nav pill
const sections = document.querySelectorAll('section[id]');
const pills = document.querySelectorAll('.nav-pill');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      pills.forEach(p => p.classList.remove('active'));
      const match = document.querySelector(`.nav-pill[href="#${e.target.id}"]`);
      if(match) match.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => secObs.observe(s));
