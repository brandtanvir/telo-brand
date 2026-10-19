"""Build case-study.html: the Behance presentation with motion playing inline (web edition).
Run after build.py:  python3 -I src/build_case_study.py"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
html = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()


def film(name, src, poster, tag, title, cap, theme="deep"):
    return f'''
<section class="m m--{theme} pad mv" data-name="{name}">
  <div class="head"><div><p class="tag">{tag}</p><h2 class="t-l">{title}</h2></div><p class="cap">{cap}</p></div>
  <div class="mv__frame"><video src="{src}" poster="{poster}" controls playsinline preload="metadata"></video></div>
</section>'''


def loop(name, src, tag, title, cap, theme="sage", frame=True):
    cls = "mv__frame" if frame else "mv__frame mv__frame--bare"
    return f'''
<section class="m m--{theme} pad mv" data-name="{name}">
  <div class="head"><div><p class="tag">{tag}</p><h2 class="t-l">{title}</h2></div><p class="cap">{cap}</p></div>
  <div class="{cls}"><video data-loop src="{src}" muted loop playsinline preload="none"></video></div>
</section>'''


def after(name, block):
    global html
    m = re.search(rf'<section[^>]*data-name="{re.escape(name)}"', html)
    assert m, name
    end = html.index("</section>", m.end()) + len("</section>")
    html = html[:end] + block + html[end:]


after("01-cover", film("01b-launch-film", "assets/media/telo-launch-film-web.mp4", "assets/media/launch-poster.jpg",
                       "Launch film · 43s", 'Meet <em class="lime">Telo.</em>',
                       "The brand story in 43 seconds: the problem, the name, the idea behind the logo and the product. Voiceover by ElevenLabs, sound design and motion by DesignMonks."))
after("12-colour", loop("12b-brand-system", "assets/media/telo-brand-system.mp4", "Brand system in motion",
                        'Palette, type,<br><em>data.</em>', "The palette sweeps in, Geist morphs through its weights, and range bars settle into their optimal zones."))
after("19-website-sections", loop("19b-walkthrough", "assets/media/telo-website-walkthrough-web.mp4", "Website walkthrough",
                                  'Feel the <em class="lime">scroll.</em>', "A real recording of the live site: pinned film, word-by-word manifesto, biomarker explorer, habits gallery and pricing toggle.", theme="deep", frame=False))
after("23-app-screens", loop("23b-app-flow", "assets/media/telo-app-flow.mp4", "Prototype",
                             'Six screens,<br>one <em>flow.</em>', "Onboarding, Telo age, biomarkers, marker detail, care chat and results, with taps and transitions."))
after("26-social", film("26b-promo-film", "assets/media/telo-promo-web.mp4", "assets/media/promo-poster.jpg",
                        "Promo film · 41s", 'How Telo <em class="lime">works.</em>',
                        "Why we exist, the four-step method and the app's features, for paid social and the product page.", theme="pine"))

# Motion module: swap the static strip (inside 17-motion only) for the live logo reveal
m17 = html.index('data-name="17-motion"')
i0 = html.index('<div class="mo">', m17)
note = html.index('<div class="mo__note">', i0)
i1 = html.index('</div>', note) + len('</div>')
html = html[:i0] + '<div class="mv__frame"><video data-loop src="assets/media/telo-logo-reveal.mp4" muted loop playsinline preload="none"></video></div>' + html[i1:]

extra_css = '''
<style>
  .mv .mv__frame{border-radius:28px;overflow:hidden;background:#000;box-shadow:0 60px 100px -50px rgba(8,37,25,.55);aspect-ratio:16/9}
  .mv .mv__frame--bare{background:transparent;box-shadow:none;border-radius:20px}
  .mv video,.m .mv__frame video{display:block;width:100%;height:100%;object-fit:cover}
  .m--deep .cap,.m--pine .cap{color:rgba(245,243,234,.66)}
  .cs-bar{position:fixed;z-index:100;top:16px;right:16px;display:flex;gap:8px;font-family:var(--f-sans)}
  .cs-bar a{height:44px;display:flex;align-items:center;padding:0 18px;border-radius:99px;background:rgba(14,58,45,.9);color:#F5F3EA;font-size:14px;text-decoration:none;backdrop-filter:blur(10px)}
  .cs-bar a.lime{background:#C9F26B;color:#0E3A2D}
  html{background:#E9E7DF}
</style>'''
html = html.replace("</head>", extra_css + "\n</head>", 1)
html = html.replace("<title>Telo | Brand Identity &amp; Digital Product | DesignMonks</title>",
                    "<title>Telo | Case Study with Motion | DesignMonks</title>\n<meta name=\"description\" content=\"Telo brand identity and digital product case study by DesignMonks: logo, colour, type, website, app, launch film and promo.\">\n<meta property=\"og:image\" content=\"assets/media/launch-poster.jpg\">")
bar = '<nav class="cs-bar"><a href="../index.html">Live website ↗</a><a href="../brand.html">Brand guide</a><a class="lime" href="#01b-launch-film">Watch the film</a></nav>\n'
html = html.replace('<main class="deck">', bar + '<main class="deck">', 1)
script = '''
<script>
  // Fit the 1400px canvas to any screen
  const fit = () => { document.querySelector('.deck').style.zoom = Math.min(1, innerWidth / 1400); };
  addEventListener('resize', fit); fit();
  // Loops only play while visible
  const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause(); }), { rootMargin: '200px' });
  document.querySelectorAll('video[data-loop]').forEach(v => io.observe(v));
  // Anchor links to modules
  document.querySelectorAll('.m[data-name]').forEach(m => m.id = m.dataset.name);
</script>'''
html = html.replace("</body>", script + "\n</body>", 1)
open(os.path.join(ROOT, "case-study.html"), "w", encoding="utf-8").write(html)
print("built case-study.html")
