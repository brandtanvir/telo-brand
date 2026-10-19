/* =========================================================
   TELO — Log in / Create account (front-end demo, no data sent)
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!window.gsap;
  const params = new URLSearchParams(location.search);
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------- Toast ---------- */
  const toast = $('.toast');
  let tt;
  const say = msg => { toast.textContent = msg; toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('is-on'), 2400); };

  /* ---------- Views ---------- */
  const seg = $('.seg'), views = $$('.view');
  let booting = true;
  document.body.classList.add('no-anim');
  function show(id) {
    views.forEach(v => { v.hidden = v.id !== id; });
    const v = $('#' + id);
    if (hasGsap && !reduce && !booting) gsap.fromTo(v, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7, ease: 'expo.out' });
    const focusable = v.querySelector('input:not([type=checkbox]):not([type=radio])');
    if (focusable && matchMedia('(hover: hover)').matches) setTimeout(() => focusable.focus({ preventScroll: true }), 60);
  }
  function setMode(mode) {
    seg.hidden = false;
    seg.dataset.mode = mode;
    $$('[role=tab]', seg).forEach(t => t.setAttribute('aria-selected', String(t.dataset.mode === mode)));
    show(mode === 'signup' ? 'view-signup' : 'view-login');
    const u = new URL(location.href);
    u.searchParams.set('mode', mode);
    history.replaceState(null, '', u);
  }
  $$('[role=tab]', seg).forEach(t => t.addEventListener('click', () => setMode(t.dataset.mode)));
  seg.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const next = seg.dataset.mode === 'login' ? 'signup' : 'login';
    setMode(next); $(`[data-mode=${next}]`, seg).focus();
  });
  $$('[data-go]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.go)));
  $('[data-forgot]').addEventListener('click', () => {
    $('#fg-email').value = $('#li-email').value;
    show('view-forgot');
  });

  /* ---------- Field helpers ---------- */
  const fieldOf = input => input.closest('.field');
  function setErr(input, msg) {
    const f = fieldOf(input);
    f.classList.toggle('is-bad', !!msg);
    f.classList.toggle('is-ok', !msg && !!input.value);
    $('.err', f).textContent = msg || '';
    input.setAttribute('aria-invalid', String(!!msg));
    return !msg;
  }
  $$('input').forEach(i => i.addEventListener('input', () => { if (fieldOf(i)?.classList.contains('is-bad')) setErr(i, ''); }));
  const checkEmail = i => setErr(i, !i.value.trim() ? 'Enter your email address.' : !EMAIL.test(i.value.trim()) ? 'That doesn’t look like a valid email.' : '');
  const required = (i, label) => setErr(i, i.value.trim() ? '' : `${label} is required.`);
  function busy(btn, ms) {
    btn.classList.add('is-busy');
    return new Promise(r => setTimeout(() => { btn.classList.remove('is-busy'); r(); }, reduce ? 200 : ms));
  }
  function focusFirstBad(form) { $('.is-bad input', form)?.focus(); }

  /* ---------- Password eye ---------- */
  $$('[data-eye]').forEach(b => b.addEventListener('click', () => {
    const i = $('input', b.parentElement), show = i.type === 'password';
    i.type = show ? 'text' : 'password';
    b.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    $('use', b).setAttribute('href', show ? '#eye-off' : '#eye');
  }));

  /* ---------- Social ---------- */
  $$('[data-social]').forEach(b => b.addEventListener('click', () => say(`Concept demo: ${b.dataset.social} sign-in isn’t connected.`)));

  /* ---------- Ring animation ---------- */
  function ring(view) {
    const arc = $('.done__arc', view), dot = $('.done__dot', view);
    if (!hasGsap) return;
    const len = arc.getTotalLength();
    gsap.set(arc, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(dot, { scale: 0, transformOrigin: '50% 50%' });
    gsap.timeline()
      .to(arc, { strokeDashoffset: 0, duration: reduce ? 0 : 1.4, ease: 'power2.inOut' })
      .to(dot, { scale: 1, duration: reduce ? 0 : .6, ease: 'back.out(4)' });
  }

  /* ---------- Log in ---------- */
  $('#form-login').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.currentTarget, em = $('#li-email'), pw = $('#li-pass');
    const ok = [checkEmail(em), setErr(pw, !pw.value ? 'Enter your password.' : pw.value.length < 8 ? 'Passwords are at least 8 characters.' : '')].every(Boolean);
    if (!ok) return focusFirstBad(f);
    await busy($('button[type=submit]', f), 1200);
    seg.hidden = true;
    show('view-done-login');
    ring($('#view-done-login'));
  });

  /* ---------- Forgot ---------- */
  $('#form-forgot').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.currentTarget, em = $('#fg-email');
    if (!checkEmail(em)) return em.focus();
    await busy($('button[type=submit]', f), 1000);
    f.hidden = true;
    $('.sent__mail').textContent = em.value.trim();
    $('#view-forgot .sent').hidden = false;
  });

  /* ---------- Sign up: steps ---------- */
  let step = 1;
  function goStep(n) {
    step = n;
    $$('#view-signup .step').forEach(s => { s.hidden = +s.dataset.step !== n; });
    $('.steps').hidden = n > 3;
    $('.steps__n').textContent = Math.min(n, 3);
    $('.steps__bar i').style.width = `${Math.min(n, 3) / 3 * 100}%`;
    seg.hidden = n > 1;
    const s = $(`#view-signup .step[data-step="${n}"]`);
    if (hasGsap && !reduce && !booting) gsap.fromTo(s, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: .7, ease: 'expo.out' });
    const first = s.querySelector('input:not([type=checkbox]):not([type=radio])');
    if (first && matchMedia('(hover: hover)').matches) setTimeout(() => first.focus({ preventScroll: true }), 60);
    if (n === 4) ring(s);
    if (!booting) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }
  $$('[data-prev]').forEach(b => b.addEventListener('click', () => goStep(step - 1)));

  /* password strength */
  const pass = $('#su-pass'), meter = $('.meter');
  pass.addEventListener('input', () => {
    const v = pass.value;
    const rules = { len: v.length >= 8, num: /\d/.test(v), case: /[a-z]/.test(v) && /[A-Z]/.test(v) };
    Object.entries(rules).forEach(([k, ok]) => $(`[data-rule=${k}]`).classList.toggle('ok', ok));
    const score = !v ? 0 : Object.values(rules).filter(Boolean).length + (v.length >= 12 ? 1 : 0);
    meter.dataset.s = Math.min(score, 4);
  });

  $('#form-s1').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.currentTarget, v = pass.value;
    const terms = $('#su-terms');
    const ok = [
      required($('#su-first'), 'First name'),
      required($('#su-last'), 'Last name'),
      checkEmail($('#su-email')),
      setErr(pass, !v ? 'Create a password.' : (v.length < 8 || !/\d/.test(v) || !(/[a-z]/.test(v) && /[A-Z]/.test(v))) ? 'Use 8+ characters with a number and upper and lower case.' : '')
    ].every(Boolean);
    $('.err--terms').textContent = terms.checked ? '' : 'Please accept the terms to continue.';
    if (!ok || !terms.checked) return ok ? terms.focus() : focusFirstBad(f);
    await busy($('button[type=submit]', f), 700);
    goStep(2);
  });

  $('#form-s2').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.currentTarget;
    const goals = $$('input[name=goal]:checked', f).length;
    $('.err--chips').textContent = goals ? '' : 'Pick at least one goal.';
    const dob = $('#su-dob');
    let dobMsg = '';
    if (!dob.value) dobMsg = 'Enter your date of birth.';
    else {
      const age = (Date.now() - new Date(dob.value)) / 31557600000;
      if (age < 18) dobMsg = 'Telo members need to be 18 or older.';
      else if (age > 100) dobMsg = 'Please check the year.';
    }
    const ok = [setErr(dob, dobMsg), required($('#su-zip'), 'ZIP / postcode')].every(Boolean);
    if (!goals) return $('input[name=goal]', f).focus();
    if (!ok) return focusFirstBad(f);
    await busy($('button[type=submit]', f), 700);
    goStep(3);
  });

  /* plan summary */
  const PRICES = { essentials: 49, complete: 129 };
  function updateSummary() {
    const p = $('input[name=plan]:checked').value;
    $('.sum__bill').textContent = `$${(PRICES[p] * 12).toLocaleString('en-US')} / year`;
  }
  $$('input[name=plan]').forEach(r => r.addEventListener('change', updateSummary));
  const pre = params.get('plan');
  if (pre && PRICES[pre]) $(`input[name=plan][value=${pre}]`).checked = true;
  updateSummary();

  $('#form-s3').addEventListener('submit', async e => {
    e.preventDefault();
    await busy($('button[type=submit]', e.currentTarget), 1400);
    $('.done__name').textContent = $('#su-first').value.trim() || 'friend';
    goStep(4);
  });

  /* ---------- Visual panel ---------- */
  if (hasGsap) {
    gsap.to('.vc__ring .val', { strokeDashoffset: 28, duration: reduce ? 0 : 2, delay: .4, ease: 'power3.inOut' });
    if (!reduce) gsap.from('.visual__body > *', { opacity: 0, y: 24, duration: 1.2, stagger: .1, ease: 'expo.out', delay: .2 });
  } else {
    $('.vc__ring .val').style.strokeDashoffset = 28;
  }

  /* ---------- Init ---------- */
  setMode(params.get('mode') === 'signup' ? 'signup' : 'login');
  goStep(1);
  booting = false;
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove('no-anim')));
})();
