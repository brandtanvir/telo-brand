/* =========================================================
   TELO — Website interactions
   GSAP + ScrollTrigger + Lenis
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;

  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove('js');
    $('.loader')?.remove();
    document.body.classList.remove('is-loading');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const scrollTo = target => lenis ? lenis.scrollTo(target, { offset: -20, duration: 1.6 }) : document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') { e.preventDefault(); return; }
    if (!$(id)) return;
    e.preventDefault();
    closeMenu();
    scrollTo(id === '#top' ? 0 : id);
  }));

  /* ---------- Split text ---------- */
  $$('[data-split]').forEach(el => {
    el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i)
      .map(chunk => `<span class="line"><span>${chunk.trim()}</span></span>`).join('');
  });
  $$('[data-words]').forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  });

  /* ---------- Preloader → hero intro ---------- */
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
  intro
    .from('.hero__title .line>span', { yPercent: 110, duration: 1.4, stagger: .1 })
    .to('.hero [data-reveal]', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: .08 }, '-=1.1')
    .from('.agecard', { y: 60, opacity: 0, filter: 'blur(10px)', duration: 1.4 }, '-=1.2')
    .to('.agecard__ring .val', { strokeDashoffset: 28, duration: 2, ease: 'power3.inOut' }, '-=1')
    .to('.agecard__spark path', { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, '<')
    .add(() => countUp($('.agecard [data-count]')), '<')
    .from('.logos li', { opacity: 0, y: 14, duration: 1, stagger: { each: .06, from: 'random' } }, '-=1.6')
    .from('.nav', { y: -90, opacity: 0, duration: 1.2 }, 0);

  const startSite = () => {
    document.body.classList.remove('is-loading');
    lenis?.start();
    intro.play();
    ScrollTrigger.refresh();
  };

  if (reduce) {
    $('.loader').remove();
    gsap.set('[data-reveal]', { clearProps: 'all' });
    startSite();
    intro.progress(1);
  } else {
    const arc = $('.loader__arc');
    const len = arc.getTotalLength();
    gsap.set(arc, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set('.loader__dot', { scale: 0, transformOrigin: '50% 50%' });
    const counter = { v: 0 };
    let seen = false;
    try { seen = sessionStorage.getItem('telo-seen') === '1'; sessionStorage.setItem('telo-seen', '1'); } catch (e) {}
    gsap.timeline().timeScale(seen ? 2.4 : 1)
      .to(arc, { strokeDashoffset: 0, duration: 1.7, ease: 'power2.inOut' })
      .to(counter, { v: 100, duration: 1.7, ease: 'power2.inOut', onUpdate: () => { $('.loader__count').textContent = String(Math.round(counter.v)).padStart(2, '0'); } }, 0)
      .to('.loader__dot', { scale: 1, duration: .6, ease: 'back.out(3)' }, '-=.15')
      .to('.loader__inner', { scale: .92, opacity: 0, duration: .5, ease: 'power2.in' }, '+=.25')
      .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '-=.15')
      .add(startSite, '-=.55')
      .add(() => $('.loader').remove());
  }

  /* ---------- Generic reveals ---------- */
  ScrollTrigger.batch('[data-reveal]:not(.hero [data-reveal])', {
    start: 'top 88%',
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out', stagger: .08 })
  });
  $$('[data-split]:not(.hero__title)').forEach(el => {
    gsap.from($$('.line>span', el), {
      yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: .09,
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* ---------- Counters ---------- */
  function countUp(el) {
    if (!el || el.dataset.done) return;
    el.dataset.done = 1;
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0), o = { v: 0 };
    gsap.to(o, { v: end, duration: 2, ease: 'power3.out', onUpdate: () => { el.textContent = o.v.toFixed(dec); } });
  }
  $$('[data-count]').forEach(el => {
    if (el.closest('.agecard')) return;
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => countUp(el) });
  });

  /* ---------- Hero glow + parallax ---------- */
  if (!reduce) {
    gsap.to('.hero__glow .g1', { xPercent: 12, yPercent: 10, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.hero__glow .g2', { xPercent: -18, yPercent: 16, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.hero__glow .g3', { xPercent: 20, yPercent: -12, duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.hero__glow', { scale: 1.6, yPercent: 30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__copy', { yPercent: -18, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: true } });
    if (fine) {
      const card = $('.agecard'), glow = $('.hero__glow');
      const qx = gsap.quickTo(card, 'x', { duration: 1, ease: 'power3' }), qy = gsap.quickTo(card, 'y', { duration: 1, ease: 'power3' });
      const gx = gsap.quickTo(glow, 'x', { duration: 2, ease: 'power3' }), gy = gsap.quickTo(glow, 'y', { duration: 2, ease: 'power3' });
      $('.hero').addEventListener('mousemove', e => {
        const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
        qx(nx * -24); qy(ny * -18); gx(nx * 60); gy(ny * 40);
      });
    }
  }

  /* ---------- Nav CTA appears after hero CTA scrolls away ---------- */
  const nav = $('[data-nav]'), navCta = $('.nav__cta');
  const ctaVisible = on => {
    nav.classList.toggle('show-cta', on);
    navCta.tabIndex = on ? 0 : -1;
    navCta.setAttribute('aria-hidden', String(!on));
  };
  ctaVisible(false);
  ScrollTrigger.create({
    trigger: '.hero__cta', start: 'top 70px',
    onEnter: () => ctaVisible(true),
    onLeaveBack: () => ctaVisible(false)
  });

  /* ---------- Mobile menu ---------- */
  const burger = $('.nav__burger');
  const menuEl = $('.menu');
  menuEl.inert = true;
  function closeMenu() { menuEl.inert = true; document.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); $('.menu').setAttribute('aria-hidden', 'true'); lenis?.start(); }
  burger.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    menuEl.inert = !open;
    burger.setAttribute('aria-expanded', String(open));
    $('.menu').setAttribute('aria-hidden', String(!open));
    open ? lenis?.stop() : lenis?.start();
  });

  /* ---------- Manifesto: word-by-word ink ---------- */
  const words = $$('.manifesto .w');
  if (reduce) gsap.set(words, { opacity: 1 });
  else {
    gsap.timeline({
      scrollTrigger: { trigger: '.manifesto', start: 'top top', end: '+=140%', pin: true, scrub: .6 }
    })
      .to(words, { opacity: 1, stagger: .1, ease: 'none' })
      .from('.manifesto__foot', { opacity: 0, y: 20 }, '-=.4');
  }

  /* ---------- Method: sticky split with swapping media ---------- */
  const steps = $$('.step'), media = $$('.mm'), hudN = $('.method__hudn'), hudBar = $('.method__bar i');
  let current = -1;
  function setStep(i) {
    if (i === current) return;
    media.forEach((m, k) => {
      m.classList.toggle('was-active', k === current);
      m.classList.toggle('is-active', k === i);
      const v = $('video', m);
      if (k === i) v.play().catch(() => {}); else if (k !== current) v.pause();
    });
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    hudN.textContent = `0${i + 1} / 0${steps.length}`;
    hudBar.style.width = `${(i + 1) / steps.length * 100}%`;
    current = i;
    clearTimeout(setStep.t);
    setStep.t = setTimeout(() => media.forEach((m, k) => { if (k !== current) $('video', m).pause(); }), 1200);
  }
  setStep(0);
  let methodST = null;
  gsap.matchMedia().add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    // Pin the split and let scroll progress walk through the steps
    methodST = ScrollTrigger.create({
      trigger: '.method', start: 'top top', end: () => '+=' + innerHeight * .7 * steps.length, pin: true,
      onUpdate: self => setStep(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)))
    });
    return () => { methodST = null; };
  });
  gsap.matchMedia().add('(max-width: 900px)', () => {
    const sts = steps.map((s, i) => ScrollTrigger.create({ trigger: s, start: 'top 70%', end: 'bottom 70%', onToggle: self => self.isActive && setStep(i) }));
    return () => sts.forEach(st => st.kill());
  });
  steps.forEach((s, i) => s.addEventListener('click', () => {
    if (methodST && lenis) lenis.scrollTo(methodST.start + (methodST.end - methodST.start) * (i + .5) / steps.length, { duration: 1.2 });
    else setStep(i);
  }));
  ScrollTrigger.create({
    trigger: '.method', start: 'top bottom', end: 'bottom top',
    onToggle: self => { const v = $('.mm.is-active video'); self.isActive ? v.play().catch(() => {}) : v.pause(); }
  });

  /* ---------- Biomarker explorer ---------- */
  // type: low = lower is better, high = higher is better, mid = in-range is best. pos = 0–100 along the bar
  const BIO = {
    heart: { score: 92, items: [
      ['ApoB', 'Atherogenic particles', '72', 'mg/dL', 'low', 30],
      ['Lp(a)', 'Inherited cardiac risk', '18', 'nmol/L', 'low', 18],
      ['LDL-C', 'LDL cholesterol', '88', 'mg/dL', 'low', 40],
      ['Resting HR', 'From your wearable', '54', 'bpm', 'mid', 46],
      ['Blood pressure', '7-day average', '116/74', 'mmHg', 'mid', 42]] },
    metabolic: { score: 84, items: [
      ['HbA1c', '3-month glucose', '5.3', '%', 'mid', 50],
      ['Fasting insulin', 'Insulin sensitivity', '6.1', 'μIU/mL', 'low', 34],
      ['Fasting glucose', 'Morning baseline', '88', 'mg/dL', 'mid', 54],
      ['Triglycerides', 'Blood fats', '140', 'mg/dL', 'low', 62],
      ['Uric acid', 'Metabolic stress', '5.1', 'mg/dL', 'mid', 44]] },
    hormones: { score: 88, items: [
      ['Free testosterone', 'Energy, muscle, mood', '112', 'pg/mL', 'mid', 58],
      ['TSH', 'Thyroid signal', '1.8', 'mIU/L', 'mid', 46],
      ['Cortisol (AM)', 'Stress rhythm', '14', 'μg/dL', 'mid', 52],
      ['DHEA-S', 'Adrenal reserve', '260', 'μg/dL', 'mid', 62],
      ['Vitamin D', '25-OH', '34', 'ng/mL', 'high', 42]] },
    inflammation: { score: 71, items: [
      ['hs-CRP', 'Systemic inflammation', '1.4', 'mg/L', 'low', 54],
      ['Homocysteine', 'Vascular + brain risk', '11.8', 'μmol/L', 'low', 76],
      ['Ferritin', 'Iron stores', '120', 'ng/mL', 'mid', 48],
      ['WBC', 'Immune activity', '5.6', 'K/μL', 'mid', 44],
      ['GGT', 'Liver + oxidative stress', '22', 'U/L', 'low', 28]] },
    fitness: { score: 95, items: [
      ['VO₂ max', 'Strongest longevity predictor', '46', 'mL/kg/min', 'high', 84],
      ['Grip strength', 'Whole-body strength proxy', '48', 'kg', 'high', 74],
      ['Lean mass index', 'DEXA', '19.2', 'kg/m²', 'high', 66],
      ['Visceral fat', 'DEXA', '0.6', 'lb', 'low', 20],
      ['Sleep efficiency', '30-day average', '91', '%', 'high', 78]] }
  };
  const status = (t, p) => t === 'low' ? (p < 45 ? 'opt' : p < 70 ? 'ok' : 'watch')
    : t === 'high' ? (p > 55 ? 'opt' : p > 30 ? 'ok' : 'watch')
    : (p < 16 || p > 84 ? 'watch' : (p < 34 || p > 66) ? 'ok' : 'opt');
  const LABEL = { opt: 'Optimal', ok: 'Normal', watch: 'Watch' };
  const list = $('.bio__list'), tabs = $$('.bio__tabs button'), tabInd = $('.bio__tabind');

  function moveInd(ind, btn) {
    ind.style.width = btn.offsetWidth + 'px';
    ind.style.transform = `translateX(${btn.offsetLeft - 5}px)`;
  }
  function renderBio(cat, animate = true) {
    const d = BIO[cat];
    $('.bio__cat').textContent = cat[0].toUpperCase() + cat.slice(1);
    const sc = $('.bio__scoren'), from = { v: +sc.textContent || 0 };
    gsap.to(from, { v: d.score, duration: animate ? 1.2 : 0, ease: 'power3.out', onUpdate: () => sc.textContent = Math.round(from.v) });
    list.innerHTML = d.items.map(([n, sub, val, unit, t, p]) => {
      const s = status(t, p);
      return `<li class="bm"><div class="bm__name"><b>${n}</b><span>${sub}</span></div>
        <div class="bm__bar ${t === 'low' ? 'is-low' : t === 'high' ? 'is-high' : ''}"><i class="bm__pin" style="left:${p}%"></i></div>
        <div class="bm__val">${val} <span style="font-weight:400;color:var(--t-3);font-size:.8em">${unit}</span><small class="${s}">${LABEL[s]}</small></div></li>`;
    }).join('');
    if (animate && !reduce) {
      gsap.from($$('.bm', list), { opacity: 0, y: 16, duration: .8, stagger: .06, ease: 'expo.out' });
      $$('.bm__pin', list).forEach((pin, i) => gsap.from(pin, { left: '0%', duration: 1.4, delay: .1 + i * .06, ease: 'expo.out' }));
    }
  }
  tabs.forEach(b => b.addEventListener('click', () => {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t === b)));
    moveInd(tabInd, b);
    renderBio(b.dataset.cat);
  }));
  renderBio('heart', false);
  ScrollTrigger.create({ trigger: '.bio__panel', start: 'top 75%', once: true, onEnter: () => renderBio($('.bio__tabs [aria-selected=true]').dataset.cat) });

  /* ---------- App screens ---------- */
  const feats = $$('.app__feats li'), screens = $$('.scr');
  let screenIdx = 0, screenTimer;
  function showScreen(i) {
    screenIdx = i;
    feats.forEach((f, k) => f.classList.toggle('is-active', k === i));
    screens.forEach((s, k) => s.classList.toggle('is-active', k === i));
  }
  function autoScreens() { clearInterval(screenTimer); screenTimer = setInterval(() => showScreen((screenIdx + 1) % screens.length), 5000); }
  feats.forEach((f, i) => {
    f.addEventListener('click', () => { showScreen(i); autoScreens(); });
    f.addEventListener('mouseenter', () => { if (fine) { showScreen(i); autoScreens(); } });
  });
  ScrollTrigger.create({ trigger: '.app', start: 'top 60%', end: 'bottom top', onToggle: s => s.isActive ? autoScreens() : clearInterval(screenTimer) });
  if (!reduce) {
    gsap.from('.phone', { y: 120, rotate: 6, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.app__stage', start: 'top 80%' } });
    gsap.from('.chip', { scale: .6, opacity: 0, duration: 1.2, stagger: .12, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.app__stage', start: 'top 60%' } });
    $$('.chip').forEach(c => gsap.to(c, { yPercent: -60 * +c.dataset.depth, ease: 'none', scrollTrigger: { trigger: '.app', start: 'top bottom', end: 'bottom top', scrub: true } }));
    if (fine) {
      const stage = $('.app__stage'), phone = $('.phone');
      stage.addEventListener('mousemove', e => {
        const r = stage.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
        gsap.to(phone, { rotateY: nx * 14, rotateX: -ny * 10, duration: .8, ease: 'power3', transformPerspective: 1000 });
      });
      stage.addEventListener('mouseleave', () => gsap.to(phone, { rotateY: 0, rotateX: 0, duration: 1.2, ease: 'expo' }));
    }
  }

  /* ---------- Horizontal gallery ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    const track = $('.hscroll__track'), viewport = $('.hscroll__viewport');
    const pills = $$('.pillars button'), cards = $$('.hcard', track);
    const dist = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    // the pillar whose card sits nearest the left edge of the card window is "active"
    const activeAt = x => {
      let best = 0, d = Infinity;
      cards.forEach((c, i) => { const v = Math.abs(c.offsetLeft - x); if (v < d) { d = v; best = i; } });
      return best;
    };
    const setPill = i => pills.forEach((p, k) => p.classList.toggle('is-active', k === i));
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hscroll', start: 'top top', end: () => '+=' + dist(), pin: '.hscroll__pin', scrub: .8, invalidateOnRefresh: true,
        onUpdate: self => setPill(self.progress > .985 ? cards.length - 1 : activeAt(self.progress * dist()))
      }
    });
    tl.to(track, { x: () => -dist(), ease: 'none' }, 0)
      .to('.hscroll__progress i', { scaleX: 1, ease: 'none' }, 0);
    const onPill = e => {
      const i = +e.currentTarget.dataset.i, st = tl.scrollTrigger;
      const p = i === cards.length - 1 ? 1 : Math.min(1, cards[i].offsetLeft / dist());
      const y = st.start + (st.end - st.start) * p;
      lenis ? lenis.scrollTo(y, { duration: 1.4 }) : window.scrollTo({ top: y, behavior: 'smooth' });
    };
    pills.forEach(p => p.addEventListener('click', onPill));
    $$('.hcard video').forEach(v => gsap.fromTo(v, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: v.parentElement, containerAnimation: tl, start: 'left right', end: 'right left', scrub: true } }));
    return () => pills.forEach(p => p.removeEventListener('click', onPill));
  });

  /* ---------- Videos: play only when visible ---------- */
  const vio = new IntersectionObserver(entries => entries.forEach(en => {
    const v = en.target;
    if (en.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
  }), { rootMargin: '200px' });
  $$('video').forEach(v => { if (!v.closest('.mm')) vio.observe(v); });

  /* ---------- Partners segmented control ---------- */
  const segBtns = $$('.seg button'), segInd = $('.seg__ind');
  segBtns.forEach(b => b.addEventListener('click', () => {
    segBtns.forEach(x => x.setAttribute('aria-selected', String(x === b)));
    moveInd(segInd, b);
    $$('.pgrid').forEach(p => {
      const on = p.dataset.pane === b.dataset.p;
      p.hidden = !on;
      if (on) {
        $$('[data-count]', p).forEach(c => { delete c.dataset.done; countUp(c); });
        $$('video', p).forEach(v => v.play().catch(() => {}));
        if (!reduce) gsap.from($$('.pcard', p), { opacity: 0, y: 30, duration: 1, stagger: .07, ease: 'expo.out' });
      }
    });
    ScrollTrigger.refresh();
  }));
  if (!reduce) gsap.from('.pgrid:not([hidden]) .pcard', { opacity: 0, y: 40, duration: 1.2, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.pgrid', start: 'top 80%' } });

  const placeInds = () => {
    moveInd(tabInd, $('.bio__tabs [aria-selected=true]'));
    moveInd(segInd, $('.seg [aria-selected=true]'));
  };
  placeInds();
  addEventListener('resize', placeInds);
  document.fonts?.ready.then(placeInds);

  /* ---------- Arrow-key navigation for tab lists ---------- */
  $$('[role=tablist]').forEach(list => list.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const btns = $$('[role=tab]', list), i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    const next = btns[(i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length];
    next.focus(); next.click(); e.preventDefault();
  }));

  /* ---------- Toast (store badges) ---------- */
  const toast = $('.toast');
  let toastT;
  const say = msg => { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('is-on'), 2200); };
  $$('[data-store]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); say('Telo is a concept app. Store listing coming soon.'); }));

  /* ---------- Active section in nav ---------- */
  $$('.nav__links a').forEach(a => {
    const sec = $(a.getAttribute('href'));
    if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: st => a.classList.toggle('is-on', st.isActive) });
  });

  /* ---------- Testimonial marquee (auto + drag + scroll velocity) ---------- */
  const mq = $('[data-marquee]'), mqTrack = $('.marquee__track', mq);
  mqTrack.innerHTML += mqTrack.innerHTML;
  let mx = 0, drag = false, lastX = 0, vel = 0, half = 0, hover = false;
  mq.addEventListener('mouseenter', () => { hover = true; });
  mq.addEventListener('mouseleave', () => { hover = false; });
  const measure = () => { half = mqTrack.scrollWidth / 2; };
  measure(); addEventListener('resize', measure);
  mq.addEventListener('pointerdown', e => { drag = true; lastX = e.clientX; vel = 0; mq.setPointerCapture(e.pointerId); });
  mq.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - lastX; lastX = e.clientX; mx += dx; vel = dx; });
  ['pointerup', 'pointercancel'].forEach(t => mq.addEventListener(t, () => { drag = false; }));
  gsap.ticker.add(() => {
    if (!drag) {
      const boost = lenis ? Math.min(Math.abs(lenis.velocity) * .25, 8) : 0;
      vel *= .94;
      mx += vel - (reduce || hover ? 0 : .6 + boost);
    }
    if (mx <= -half) mx += half;
    if (mx > 0) mx -= half;
    mqTrack.style.transform = `translate3d(${mx}px,0,0)`;
  });

  /* ---------- Pricing toggle ---------- */
  const toggle = $('.toggle');
  toggle.addEventListener('click', () => {
    const annual = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(annual));
    $('.bill__y').classList.toggle('is-on', annual);
    $('.bill__m').classList.toggle('is-on', !annual);
    $$('.amt').forEach(a => {
      const o = { v: +a.textContent }, to = +(annual ? a.dataset.y : a.dataset.m);
      gsap.to(o, { v: to, duration: .8, ease: 'power3.out', onUpdate: () => a.textContent = Math.round(o.v) });
      gsap.fromTo(a, { yPercent: annual ? 30 : -30, opacity: .3 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'expo.out' });
    });
  });

  /* ---------- FAQ accordion (animated) ---------- */
  $$('.acc details').forEach(d => {
    const s = $('summary', d), body = $('div', d);
    s.addEventListener('click', e => {
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, duration: .5, ease: 'power3.inOut', onComplete: () => { d.open = false; body.style.height = ''; ScrollTrigger.refresh(); } });
      } else {
        $$('.acc details[open]').forEach(o => o !== d && $('summary', o).click());
        d.open = true;
        gsap.from(body, { height: 0, duration: .6, ease: 'power3.out', onComplete: () => ScrollTrigger.refresh() });
      }
    });
  });

  /* ---------- Final CTA parallax + footer wordmark draw ---------- */
  if (!reduce) {
    gsap.set('.footer__dot', { scale: 0, transformOrigin: '50% 50%' });
    gsap.to('.final__bg', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.timeline({ scrollTrigger: { trigger: '.footer__mark', start: 'top 95%', end: 'bottom bottom', scrub: 1 } })
      .to('.footer__mark path', { strokeDashoffset: 0, autoRound: false, stagger: .15, ease: 'none' })
      .to('.footer__dot', { scale: 1, ease: 'back.out(3)', duration: .3 });
  } else {
    gsap.set('.footer__mark path', { strokeDashoffset: 0 });
    gsap.set('.footer__dot', { scale: 1 });
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduce) $$('[data-magnetic]').forEach(b => {
    const qx = gsap.quickTo(b, 'x', { duration: .6, ease: 'power3' }), qy = gsap.quickTo(b, 'y', { duration: .6, ease: 'power3' });
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .3); qy((e.clientY - r.top - r.height / 2) * .4); });
    b.addEventListener('mouseleave', () => { qx(0); qy(0); });
  });

  /* ---------- Cursor ---------- */
  if (fine && !reduce) {
    const c = $('.cursor'), label = $('.cursor__label');
    const cx = gsap.quickTo(c, 'x', { duration: .45, ease: 'power3' }), cy = gsap.quickTo(c, 'y', { duration: .45, ease: 'power3' });
    let raf = 0;
    addEventListener('mousemove', e => {
      cx(e.clientX); cy(e.clientY);
      c.classList.add('is-on');
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el) return;
        const media = el.closest('[data-cursor]');
        c.classList.toggle('is-media', !!media);
        if (media) label.textContent = media.dataset.cursor;
        c.classList.toggle('is-link', !media && !!el.closest('a,button,summary,.step,.app__feats li'));
        const sec = el.closest('[data-theme]');
        document.body.dataset.cursorTheme = sec ? sec.dataset.theme : 'light';
      });
    });
    document.addEventListener('mouseleave', () => c.classList.remove('is-on'));
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
