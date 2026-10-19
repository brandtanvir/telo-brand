/* Telo app screens: single source of truth for the presentation and the prototype motion.
   Each screen is 390 x 844. Fill any element with data-screen="<id>". */
window.TELO_SCREENS = (() => {
  const status = (dark) => `<div class="a-status${dark ? ' is-dark' : ''}"><span>9:41</span><span class="a-status__ic"><i class="sig"></i><i class="wifi"></i><i class="bat"></i></span></div>`;
  const tabs = (active) => `<nav class="a-tabs">${[
    ['home', 'Home', '<path d="M4 11.5 12 5l8 6.5V20h-5v-5h-6v5H4z"/>'],
    ['markers', 'Markers', '<path d="M5 19V9M10 19V5M15 19v-7M20 19v-4"/>'],
    ['plan', 'Plan', '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/>'],
    ['care', 'Care', '<path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V16h0a2.5 2.5 0 0 1-2-2.5z"/>']
  ].map(([id, l, d]) => `<span class="${id === active ? 'on' : ''}"><svg viewBox="0 0 24 24">${d}</svg>${l}</span>`).join('')}</nav>`;
  const ring = (p, size = 150, stroke = 11, light = false) => {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r;
    return `<svg class="a-ring${light ? ' is-light' : ''}" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" class="t"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" class="v" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
  };
  const mark = `<svg class="a-mark" viewBox="-1 18 181 88"><g fill="none" stroke="currentColor" stroke-width="7.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 24V86Q12 100 26 100H29"/><path d="M3 56H28"/><path d="M41 78H85A22 22 0 1 0 79.85 92.14"/><path d="M104 24V86Q104 100 118 100"/><path d="M172.35 72.68A22 22 0 1 1 156.32 56.65"/></g><circle cx="166.56" cy="62.44" r="4.6" fill="#C9F26B"/></svg>`;
  const chev = '<svg class="a-chev" viewBox="0 0 16 16"><path d="M6 3l5 5-5 5"/></svg>';
  const back = '<svg class="a-back" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>';

  return {
    welcome: `<div class="a-screen a-welcome">
      <img class="a-welcome__bg" src="assets/photos/park.jpg" alt="">
      <div class="a-welcome__shade"></div>
      ${status(true)}
      <div class="a-welcome__top">${mark}</div>
      <div class="a-welcome__body">
        <p class="a-kicker">Preventive longevity</p>
        <h1 class="a-h1">Know how fast you’re <em>really</em> aging.</h1>
        <p class="a-p">112 biomarkers, a full-body scan and a clinician who turns it into a plan.</p>
        <div class="a-dots"><i class="on"></i><i></i><i></i></div>
        <span class="a-btn a-btn--lime">Get started</span>
        <span class="a-btn a-btn--ghost">I already have an account</span>
      </div>
    </div>`,

    home: `<div class="a-screen a-home">
      ${status()}
      <header class="a-head"><div><p class="a-sub">Tuesday, 14 Oct</p><h2 class="a-h2">Good morning, Maya</h2></div><img class="a-avatar" src="assets/photos/maya.jpg" alt=""></header>
      <section class="a-age">
        <div class="a-age__ring">${ring(.72, 132, 11, true)}<div><b>34.8</b><span>Telo age</span></div></div>
        <div class="a-age__meta"><p class="a-chip a-chip--lime">−6.2 yrs</p><p>younger than your calendar age of <b>41</b></p><svg class="a-spark" viewBox="0 0 140 34"><path d="M2 6C24 8 34 6 50 13S82 21 98 24 124 29 138 30"/></svg></div>
      </section>
      <div class="a-row"><p class="a-label">Today · 2 of 3 done</p><p class="a-link">See plan</p></div>
      <ul class="a-tasks">
        <li class="done"><i></i><div><b>Zone 2 walk</b><span>35 min · done 7:40</span></div></li>
        <li class="done"><i></i><div><b>30g protein breakfast</b><span>Greek yoghurt + oats</span></div></li>
        <li><i></i><div><b>Lights out by 22:45</b><span>Sleep is your weakest pillar</span></div></li>
      </ul>
      <section class="a-next"><div><p class="a-label">Next retest</p><b>in 23 days</b></div><span class="a-btn a-btn--pine a-btn--sm">Book draw</span></section>
      ${tabs('home')}
    </div>`,

    markers: `<div class="a-screen a-markers">
      ${status()}
      <header class="a-head"><h2 class="a-h2">Biomarkers</h2><span class="a-iconbtn"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg></span></header>
      <section class="a-sum">
        <div class="a-sum__n"><b>112</b><span>tracked · updated 3 Oct</span></div>
        <div class="a-sum__bar"><i style="--w:87%;--c:var(--opt)"></i><i style="--w:8%;--c:var(--ok)"></i><i style="--w:5%;--c:var(--watch)"></i></div>
        <div class="a-sum__legend"><span><i class="o"></i>98 optimal</span><span><i class="n"></i>9 normal</span><span><i class="w"></i>5 watch</span></div>
      </section>
      <ul class="a-cats">
        ${[['Heart', 92, 'ApoB, Lp(a), BP', 'opt'], ['Metabolic', 84, 'HbA1c, insulin', 'opt'], ['Hormones', 88, 'Testosterone, TSH', 'opt'], ['Inflammation', 71, 'hs-CRP, homocysteine', 'watch'], ['Fitness', 95, 'VO₂ max, grip', 'opt'], ['Brain', 90, 'Omega-3, B12', 'opt']]
          .map(([n, s, d, st]) => `<li><div class="a-cats__ring">${ring(s / 100, 44, 5)}<b>${s}</b></div><div><b>${n}</b><span>${d}</span></div>${st === 'watch' ? '<em class="a-chip a-chip--watch">1 to watch</em>' : chev}</li>`).join('')}
      </ul>
      ${tabs('markers')}
    </div>`,

    detail: `<div class="a-screen a-detail">
      ${status()}
      <header class="a-head a-head--nav">${back}<p class="a-sub">Heart</p><span class="a-iconbtn"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span></header>
      <h2 class="a-h1 a-h1--dark">ApoB</h2>
      <p class="a-sub">Atherogenic particles · lower is better</p>
      <div class="a-val"><b>72</b><span>mg/dL</span><em class="a-chip a-chip--opt">Optimal</em></div>
      <div class="a-range"><div class="a-range__bar"><i style="left:30%"></i></div><div class="a-range__lbl"><span>Optimal &lt; 80</span><span>Watch &gt; 110</span></div></div>
      <div class="a-chart">
        <svg viewBox="0 0 340 130" preserveAspectRatio="none"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9F26B" stop-opacity=".55"/><stop offset="1" stop-color="#C9F26B" stop-opacity="0"/></linearGradient></defs><path d="M10 22L117 46L223 78L330 94V130H10Z" fill="url(#ag)"/><path d="M10 22L117 46L223 78L330 94" fill="none" stroke="#0E3A2D" stroke-width="2.5"/><g fill="#0E3A2D"><circle cx="10" cy="22" r="4"/><circle cx="117" cy="46" r="4"/><circle cx="223" cy="78" r="4"/></g><circle cx="330" cy="94" r="6" fill="#8FD63F" stroke="#fff" stroke-width="2"/></svg>
        <div class="a-chart__x"><span>Jan · 100</span><span>Apr · 91</span><span>Jul · 80</span><span>Oct · 72</span></div>
      </div>
      <section class="a-card"><p class="a-label">What’s working</p><ul class="a-why"><li><i>↑</i>Fibre up to 35g a day</li><li><i>↑</i>Zone 2 cardio, 3× a week</li><li><i>↓</i>Saturated fat down 40%</li></ul></section>
      <span class="a-btn a-btn--pine">Ask Dr. Ortiz about this</span>
    </div>`,

    plan: `<div class="a-screen a-plan">
      ${status()}
      <header class="a-head"><div><p class="a-sub">Week 32</p><h2 class="a-h2">Your plan</h2></div><span class="a-chip a-chip--lime">86% on track</span></header>
      <div class="a-week">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => `<span class="${i === 1 ? 'on' : ''}${i < 1 ? ' done' : ''}"><small>${d}</small><b>${13 + i}</b></span>`).join('')}</div>
      <div class="a-pills"><span class="on">All</span><span>Move</span><span>Eat</span><span>Sleep</span><span>Stress</span></div>
      <ul class="a-habits">
        ${[['Zone 2 walk', 'Move · 35 min', .75, '3 of 4'], ['Protein breakfast', 'Eat · 30g', .71, '5 of 7'], ['Lights out by 22:45', 'Sleep', .57, '4 of 7'], ['Breathwork', 'Stress · 4 min', .86, '6 of 7']]
          .map(([n, s, p, c]) => `<li>${ring(p, 46, 5)}<div><b>${n}</b><span>${s}</span></div><em>${c}</em></li>`).join('')}
      </ul>
      <section class="a-tip"><p class="a-label">From Dr. Ortiz</p><p>Sleep is holding back your Telo age. Let’s move bedtime 15 minutes earlier each week.</p></section>
      ${tabs('plan')}
    </div>`,

    care: `<div class="a-screen a-care">
      ${status()}
      <header class="a-head a-head--chat">${back}<img class="a-avatar a-avatar--doc" src="assets/photos/clinician.jpg" alt=""><div><b>Dr. Lena Ortiz</b><span><i></i>Online · replies in ~2h</span></div></header>
      <div class="a-thread">
        <p class="a-day">Today</p>
        <div class="a-msg in">Your Q3 results are in. ApoB is down 28% since January. The plan is working.</div>
        <div class="a-file"><span class="a-file__ic">PDF</span><div><b>Q3 results.pdf</b><span>112 biomarkers · 2.1 MB</span></div></div>
        <div class="a-msg out">Amazing! Should I keep the same routine?</div>
        <div class="a-msg in">Yes. Keep the Zone 2 sessions and let’s work on sleep next. Retest in 12 weeks.</div>
        <div class="a-typing"><i></i><i></i><i></i></div>
      </div>
      <div class="a-quick"><span>Book a call</span><span>See my plan</span><span>Thank you!</span></div>
      <div class="a-input"><span>Message Dr. Ortiz…</span><i><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></i></div>
    </div>`,

    booking: `<div class="a-screen a-booking">
      ${status()}
      <header class="a-head a-head--nav">${back}<p class="a-sub">Step 2 of 3</p><span></span></header>
      <h2 class="a-h2">Book your blood draw</h2>
      <div class="a-seg"><span class="on">At home</span><span>At a lab</span></div>
      <p class="a-label">October</p>
      <div class="a-dates">${[['Mon', 20], ['Tue', 21], ['Wed', 22], ['Thu', 23], ['Fri', 24]].map(([d, n], i) => `<span class="${i === 1 ? 'on' : ''}"><small>${d}</small><b>${n}</b></span>`).join('')}</div>
      <p class="a-label">Morning, fasted</p>
      <div class="a-slots">${['6:30', '7:00', '7:30', '8:00', '8:30', '9:00'].map((t, i) => `<span class="${i === 2 ? 'on' : ''}${i === 0 ? ' off' : ''}">${t}</span>`).join('')}</div>
      <section class="a-card a-addr"><span class="a-addr__ic"><svg viewBox="0 0 24 24"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></span><div><b>Home</b><span>214 Kent Ave, Brooklyn</span></div><p class="a-link">Change</p></section>
      <p class="a-label">Before your draw</p>
      <div class="a-expect"><div><b>Fast 10h</b><span>Water and black coffee are fine</span></div><div><b>10 min</b><span>A phlebotomist comes to you</span></div><div><b>~7 days</b><span>Results with a clinician call</span></div></div>
      <span class="a-btn a-btn--pine">Confirm Tue 21 · 7:30 AM</span>
    </div>`,

    results: `<div class="a-screen a-results">
      ${status(true)}
      <div class="a-results__glow"></div>
      <p class="a-kicker a-kicker--lime">Q3 results</p>
      <h2 class="a-h1">Your Telo age <em>dropped.</em></h2>
      <div class="a-big">${ring(.78, 230, 15, true)}<div><b>33.6</b><span>−1.2 yrs since July</span></div></div>
      <div class="a-compare">
        ${[['Heart', 88, 92], ['Metabolic', 79, 84], ['Fitness', 91, 95]].map(([n, a, b]) => `<div><span>${n}</span><i style="--a:${a}%;--b:${b}%"><u></u><s></s></i><b>${a} → ${b}</b></div>`).join('')}
      </div>
      <span class="a-btn a-btn--lime">See what changed</span>
      <span class="a-btn a-btn--ghost">Share my progress</span>
    </div>`
  };
})();

document.querySelectorAll('[data-screen]').forEach(el => {
  const html = window.TELO_SCREENS[el.dataset.screen];
  if (html) el.innerHTML = html;
});
