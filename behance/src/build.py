"""Expand logo tokens in index.src.html into fully inline SVG and write ../index.html.
Run:  python3 -I src/build.py   (from the behance folder or anywhere)"""
import math, os, re, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

PATHS = ["M12 24V86Q12 100 26 100H29", "M3 56H28", "M41 78H85A22 22 0 1 0 79.85 92.14",
         "M104 24V86Q104 100 118 100", "M172.35 72.68A22 22 0 1 1 156.32 56.65"]
DOT = (166.56, 62.44, 4.6)


def attrs(s):
    return dict(re.findall(r'(\w+)="([^"]*)"', s or ""))


def wm(a, dash=None):
    cls = f' class="wm {a.get("class", "")}"'.replace(' "', '"')
    dot = a.get("dot", "#8FD63F")
    extra = ' pathLength="1"' if dash is not None else ""
    style = f' stroke-dasharray="1" stroke-dashoffset="{dash}"' if dash is not None else ""
    p = "".join(f'<path d="{d}"{extra}{style}/>' for d in PATHS)
    return (f'<svg{cls} viewBox="-1 18 181 88" fill="none" aria-label="telo">'
            f'<g stroke="currentColor" stroke-width="7.2" stroke-linecap="round" stroke-linejoin="round">{p}</g>'
            f'<circle cx="{DOT[0]}" cy="{DOT[1]}" r="{DOT[2]}" fill="{dot}"/></svg>')


def ring_path(cx, cy, r, g0=-14, g1=-76):
    pt = lambda a: (cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a)))
    s, e = pt(g0), pt(g1)
    return f"M{s[0]:.2f} {s[1]:.2f}A{r} {r} 0 1 1 {e[0]:.2f} {e[1]:.2f}", pt(-45)


def ring(a):
    d, dp = ring_path(32, 32, 24)
    cls = f' class="{a["class"]}"' if a.get("class") else ""
    return (f'<svg{cls} viewBox="0 0 64 64" fill="none"><path d="{d}" stroke="currentColor" stroke-width="8.4" stroke-linecap="round"/>'
            f'<circle cx="{dp[0]:.2f}" cy="{dp[1]:.2f}" r="5.4" fill="{a.get("dot", "#8FD63F")}"/></svg>')


def ringprog(a):
    size = float(a.get("size", 52)); p = float(a.get("p", .7)); light = a.get("light") == "1"
    sw = size * .09; r = (size - sw) / 2; c = 2 * math.pi * r
    trk = "rgba(245,243,234,.18)" if light or not a.get("class") else "rgba(245,243,234,.25)"
    val = "#C9F26B"
    cls = f' class="{a["class"]}"' if a.get("class") else ""
    h = size / 2
    return (f'<svg{cls} viewBox="0 0 {size:g} {size:g}" width="{size:g}" height="{size:g}" fill="none">'
            f'<circle cx="{h:g}" cy="{h:g}" r="{r:.2f}" stroke="{trk}" stroke-width="{sw:.2f}"/>'
            f'<circle cx="{h:g}" cy="{h:g}" r="{r:.2f}" stroke="{val}" stroke-width="{sw:.2f}" stroke-linecap="round" '
            f'stroke-dasharray="{c:.2f}" stroke-dashoffset="{c * (1 - p):.2f}" transform="rotate(-90 {h:g} {h:g})"/></svg>')


def rings(_):
    out = '<svg viewBox="0 0 200 200" width="220" height="220" fill="none">'
    for r, col, p in [(84, "#C9F26B", .82), (62, "#F5F3EA", .64), (40, "#8FD63F", .45)]:
        c = 2 * math.pi * r
        out += (f'<circle cx="100" cy="100" r="{r}" stroke="rgba(245,243,234,.08)" stroke-width="14"/>'
                f'<circle cx="100" cy="100" r="{r}" stroke="{col}" stroke-width="14" stroke-linecap="round" stroke-dasharray="{c:.1f}" '
                f'stroke-dashoffset="{c * (1 - p):.1f}" transform="rotate(-90 100 100)"/>')
    return out + "</svg>"


def cons(_):
    lime = "#C9F26B"; g = "rgba(201,242,107,.55)"
    s = ['<svg class="cons__svg" viewBox="-34 6 248 112" fill="none">']
    # guides
    for y, lbl in [(24, "ASCENDER"), (56, "X-HEIGHT"), (100, "BASELINE")]:
        s.append(f'<path d="M-34 {y}H214" stroke="{g}" stroke-width=".3"/>')
        s.append(f'<text x="-32" y="{y - 1.6}" font-family="Geist Mono" font-size="3.4" fill="{lime}">{lbl}</text>')
    for x in (12, 104):
        s.append(f'<path d="M{x} 6V118" stroke="{g}" stroke-width=".3"/>')
    for cx in (63, 151):
        s.append(f'<circle cx="{cx}" cy="78" r="22" stroke="{g}" stroke-width=".35" stroke-dasharray="1.6 1.6"/>')
        s.append(f'<circle cx="{cx}" cy="78" r=".9" fill="{lime}"/>')
    s.append(f'<path d="M151 78L172.35 72.68M151 78L156.32 56.65" stroke="{g}" stroke-width=".35" stroke-dasharray="1.2 1.2"/>')
    s.append(f'<text x="176" y="58" font-family="Geist Mono" font-size="3.4" fill="{lime}">GAP 62°</text>')
    # filled wordmark (ghost) + skeleton
    s.append('<g stroke="rgba(245,243,234,.16)" stroke-width="7.2" stroke-linecap="round" stroke-linejoin="round">' +
             "".join(f'<path d="{d}"/>' for d in PATHS) + '</g>')
    s.append(f'<circle cx="{DOT[0]}" cy="{DOT[1]}" r="{DOT[2]}" fill="{lime}"/>')
    s.append('<g stroke="#F5F3EA" stroke-width=".45" stroke-linecap="round">' + "".join(f'<path d="{d}"/>' for d in PATHS) + '</g>')
    # handles for the two quadratic hooks
    for a, c, b in [((12, 86), (12, 100), (26, 100)), ((104, 86), (104, 100), (118, 100))]:
        s.append(f'<path d="M{a[0]} {a[1]}L{c[0]} {c[1]}L{b[0]} {b[1]}" stroke="{lime}" stroke-width=".3"/>')
        s.append(f'<circle cx="{c[0]}" cy="{c[1]}" r="1.1" fill="#082519" stroke="{lime}" stroke-width=".35"/>')
    anchors = [(12, 24), (12, 86), (26, 100), (29, 100), (3, 56), (28, 56), (41, 78), (85, 78), (79.85, 92.14),
               (104, 24), (104, 86), (118, 100), (172.35, 72.68), (156.32, 56.65)]
    for x, y in anchors:
        s.append(f'<rect x="{x - 1.1}" y="{y - 1.1}" width="2.2" height="2.2" fill="#082519" stroke="#F5F3EA" stroke-width=".35"/>')
    s.append(f'<text x="118" y="114" font-family="Geist Mono" font-size="3.4" fill="{lime}">R 22 · STROKE 7.2</text>')
    s.append("</svg>")
    return "".join(s)


def moframes(_):
    out = []
    d, dp = ring_path(32, 32, 24)
    for i, (prog, dot, label) in enumerate([(.15, 0, "0.0s"), (.55, 0, "0.6s"), (1, 1, "1.2s"), (None, .7, "1.6s"), (None, 1, "2.4s")]):
        if prog is not None:
            svg = (f'<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="24" stroke="rgba(245,243,234,.1)" stroke-width="8.4"/>'
                   f'<path d="{d}" stroke="currentColor" stroke-width="8.4" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="{1 - prog}"/>'
                   + (f'<circle cx="{dp[0]:.2f}" cy="{dp[1]:.2f}" r="5.4" fill="#C9F26B"/>' if dot else "") + "</svg>")
        else:
            svg = wm({"dot": "#C9F26B"}, dash=1 - dot if dot < 1 else 0)
        out.append(f'<div class="mo__f">{svg}<span class="mono">{label}</span></div>')
    return "".join(out)


FN = {"WM": wm, "RING": ring, "RINGPROG": ringprog, "RINGS": rings, "CONS": cons, "MOFRAMES": moframes}


def expand(html):
    return re.sub(r"\{\{(\w+)([^}]*)\}\}", lambda m: FN[m.group(1)](attrs(m.group(2))), html)


if __name__ == "__main__":
    src = open(os.path.join(HERE, "index.src.html"), encoding="utf-8").read()
    open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(expand(src))
    shutil.copy(os.path.join(ROOT, "..", "css", "tokens.css"), os.path.join(ROOT, "css", "tokens.css"))
    print("built index.html")
