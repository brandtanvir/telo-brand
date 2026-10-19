/* =========================================================
   TELO — Brand guidelines interactions
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!window.gsap || !window.ScrollTrigger) { document.documentElement.classList.remove('js'); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* Smooth scroll */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 4) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!$(id)) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(id, { duration: 1.6 }) : $(id).scrollIntoView({ behavior: 'smooth' });
  }));

  /* Cover: draw the wordmark */
  gsap.set('.cover__dot', { scale: 0, transformOrigin: '50% 50%' });
  if (reduce) gsap.set('.cover__dot', { scale: 1 });
  else gsap.timeline({ delay: .3 })
    .to('.cover__mark path', { strokeDashoffset: 0, autoRound: false, duration: 1.6, stagger: .18, ease: 'power2.inOut' })
    .to('.cover__dot', { scale: 1, duration: .7, ease: 'back.out(4)' }, '-=.2')
    .from('.cover__meta, .cover__foot', { opacity: 0, y: 20, duration: 1, ease: 'expo.out', stagger: .1 }, '-=.6');
  if (!reduce) gsap.to('.cover__mark', { yPercent: 18, scale: .94, opacity: .35, ease: 'none', scrollTrigger: { trigger: '.cover', start: 'top top', end: 'bottom top', scrub: true } });

  /* Reveals */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: b => gsap.to(b, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out', stagger: .07 })
  });

  /* Active section in nav */
  $$('.bnav__links a').forEach(a => {
    const sec = $(a.getAttribute('href'));
    if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: s => a.classList.toggle('is-on', s.isActive) });
  });

  /* Motion ring: progress slider + replay */
  const arc = $('.mring__arc'), dot = $('.mring__dot'), val = $('.mring__val span'), range = $('#motion input[type=range]');
  const len = arc.getTotalLength();
  gsap.set(arc, { strokeDasharray: len });
  gsap.set(dot, { transformOrigin: '50% 50%', scale: 0 });
  const setP = (p, dur = .6) => {
    gsap.to(arc, { strokeDashoffset: len * (1 - p / 100), duration: dur, ease: 'expo.out' });
    gsap.to(dot, { scale: p >= 100 ? 1 : 0, duration: .5, ease: p >= 100 ? 'back.out(4)' : 'power2.out' });
    val.textContent = Math.round(p);
  };
  range.addEventListener('input', () => setP(+range.value));
  const replay = () => {
    const o = { p: 0 };
    gsap.set(arc, { strokeDashoffset: len }); gsap.set(dot, { scale: 0 });
    gsap.to(o, { p: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => { gsap.set(arc, { strokeDashoffset: len * (1 - o.p / 100) }); val.textContent = Math.round(o.p); range.value = o.p; },
      onComplete: () => gsap.to(dot, { scale: 1, duration: .6, ease: 'back.out(4)' }) });
  };
  $('[data-replay]').addEventListener('click', replay);
  gsap.set(arc, { strokeDashoffset: len });
  ScrollTrigger.create({ trigger: '.motion', start: 'top 70%', once: true, onEnter: () => reduce ? setP(72, 0) : setP(72, 1.6) });

  /* Swatches: copy hex */
  const toast = $('.toast');
  let tt;
  $$('.sw').forEach(s => s.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(s.dataset.hex); toast.textContent = `Copied ${s.dataset.hex}`; }
    catch { toast.textContent = s.dataset.hex; }
    toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('is-on'), 1600);
  }));

  /* Ratio bar grows in */
  if (!reduce) gsap.from('.ratio__bar i', { width: 0, duration: 1.4, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: '.ratio', start: 'top 85%' } });

  /* Type tester */
  const tx = $('.tester__text');
  $('[data-tw]').addEventListener('input', e => { tx.style.fontWeight = e.target.value; $('.tw').textContent = e.target.value; });
  $('[data-ts]').addEventListener('input', e => { tx.style.fontSize = e.target.value + 'px'; $('.ts').textContent = e.target.value; });

  /* Elements: rings draw on view */
  if (!reduce) gsap.from('.ringsart circle', { strokeDashoffset: 300, duration: 2, stagger: .2, ease: 'expo.out', scrollTrigger: { trigger: '.ringsart', start: 'top 85%' } });

  /* Member card tilt */
  const card = $('.mcard');
  if (card && matchMedia('(hover: hover)').matches) {
    const ap = card.parentElement;
    ap.addEventListener('mousemove', e => {
      const r = ap.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
      card.style.transition = 'transform .2s';
      card.style.transform = `rotateY(${nx * 22}deg) rotateX(${-ny * 18}deg)`;
    });
    ap.addEventListener('mouseleave', () => { card.style.transition = ''; card.style.transform = ''; });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
