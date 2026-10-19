# Telo · Preventive Longevity Brand

**Brand identity, website, app UI and motion for Telo**, a concept preventive-health membership. It measures 112 biomarkers, scans the whole body and turns it all into one number: your *Telo age*.

Designed by **DesignMonks**. Concept project, 2026.

## Live

| | Link |
|---|---|
| 🌐 Website | https://brandtanvir.github.io/telo-brand/ |
| 🎬 Case study (with motion) | https://brandtanvir.github.io/telo-brand/behance/case-study.html |
| 📐 Brand guidelines | https://brandtanvir.github.io/telo-brand/brand.html |
| 🔐 Log in / sign-up flow | https://brandtanvir.github.io/telo-brand/login.html |
| 🖼️ Behance presentation (static) | https://brandtanvir.github.io/telo-brand/behance/ |

## Films

| Film | Length | Watch | Download (4K) |
|---|---|---|---|
| Launch film | 43s | [Web version](behance/assets/media/telo-launch-film-web.mp4) | [Releases](../../releases/latest) |
| Promo: how Telo works | 41s | [Web version](behance/assets/media/telo-promo-web.mp4) | [Releases](../../releases/latest) |

Both are 16:9, 3840×2160, 30 fps, with an ElevenLabs voiceover and a custom sound-design mix.

## Downloads

The [latest release](../../releases/latest) has everything that's too large for the repo:

- **4K and 1080p masters** of both films, with captions (`.srt`) and posters
- **Behance upload pack**: 27 module images at 2800px plus the cover
- **PDF** of the full presentation (vector, one page per module)
- **Figma pack**: 27 editable SVGs
- **Motion pack**: MP4, GIF and Lottie (logo reveal, brand system, app flow, website walkthrough)
- **Audio**: film mixes, voiceovers and sound effects

## What's inside

```
index.html            Website (HTML + GSAP + Lenis)
brand.html            Brand guidelines, including personas
login.html            Log in / 3-step sign-up flow
css/ js/ assets/      Site styles, interactions, logo SVGs and footage
behance/
  index.html          Behance presentation (1400px canvas, 27 modules)
  case-study.html     Same presentation with films and motion inline
  motion/             Motion sources (logo reveal, brand system, app flow)
  film/               Launch film + promo compositions (GSAP timelines)
  src/                Build scripts (presentation, case study, Lottie)
  assets/media/       Web-optimised films and motion loops
  assets/lottie/      Logo reveal Lottie JSON (light and dark)
```

### Rebuild

```bash
cd behance
python3 src/build.py            # presentation (index.html)
python3 src/build_case_study.py # case study with motion
python3 src/gen_lottie.py assets/lottie
```

To preview locally, run `python3 -m http.server` in the repo root and open `http://localhost:8000`.

## Brand system

- **Logo:** a monoline "telo" wordmark. The "o" is an open ring (a telomere cap, a progress ring and a clock face) sealed by a lime dot.
- **Colour:** Pine `#0E3A2D`, Lime `#C9F26B`, Bone `#F5F3EA`, plus Forest, Leaf, Sage, Butter and Deep.
- **Type:** Geist, Instrument Serif (italic accents) and Geist Mono (data).
- **Motion:** grow, settle, glow. Ease `cubic-bezier(.16, 1, .3, 1)`.

## Credits

- Design, motion and development: **DesignMonks**
- Footage: [Mixkit](https://mixkit.co/license/) (free license)
- Voiceover and sound effects: ElevenLabs
- Typefaces: Geist, Geist Mono, Instrument Serif (SIL Open Font License)

*Telo is a fictional brand. All names, people, partners and figures are illustrative.*
