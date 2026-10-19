"""Generate Lottie (Bodymovin) JSON for the Telo logo reveal.
The ring draws, the dot snaps in, then t-e-l write themselves. Output: pine (light bg) and bone (dark bg) versions."""
import json, math, os, sys

FPS, OP = 30, 120              # 4 seconds
S = 4                          # scale: wordmark units -> px
M = 16                         # margin in wordmark units
W, H = (181 + 2 * M) * S, (88 + 2 * M) * S


def arc_pts(cx, cy, r, a0, a1, segs):
    """Cubic bezier vertices for an arc from angle a0 to a1 (degrees, SVG screen coords)."""
    vs, ins, outs = [], [], []
    step = (a1 - a0) / segs
    k = 4 / 3 * math.tan(math.radians(step) / 4)
    for i in range(segs + 1):
        a = math.radians(a0 + step * i)
        x, y = cx + r * math.cos(a), cy + r * math.sin(a)
        tx, ty = -math.sin(a) * r * k, math.cos(a) * r * k   # tangent scaled
        vs.append([x, y]); ins.append([-tx, -ty]); outs.append([tx, ty])
    ins[0] = [0, 0]; outs[-1] = [0, 0]
    return vs, ins, outs


def hook(x):   # M x 24 V86 Q x 100 x+14 100 (+ optional H)
    v = [[x, 24], [x, 86], [x + 14, 100]]
    i = [[0, 0], [0, 0], [-14 * 2 / 3, 0]]
    o = [[0, 0], [0, 14 * 2 / 3], [0, 0]]
    return v, i, o


def shape(v, i, o):
    return {"ty": "sh", "ks": {"a": 0, "k": {"c": False, "v": v, "i": i, "o": o}}}


def build_paths():
    paths = []
    v, i, o = hook(12); v.append([29, 100]); i.append([0, 0]); o.append([0, 0]); paths.append(("t-stem", v, i, o))
    paths.append(("t-bar", [[3, 56], [28, 56]], [[0, 0], [0, 0]], [[0, 0], [0, 0]]))
    av, ai, ao = arc_pts(63, 78, 22, 0, -320, 4)            # e bowl, counter-clockwise
    paths.append(("e", [[41, 78]] + av, [[0, 0]] + ai, [[0, 0]] + ao))
    paths.append(("l", *hook(104)))
    rv, ri, ro = arc_pts(151, 78, 22, -14, 284, 4)          # ring, clockwise
    paths.append(("ring", rv, ri, ro))
    return paths


def ease(t, s, e):
    return {"t": t, "s": [s], "e": [e], "o": {"x": [0.65], "y": [0]}, "i": {"x": [0.35], "y": [1]}}


def trim(start, dur):
    return {"ty": "tm", "s": {"a": 0, "k": 0}, "o": {"a": 0, "k": 0}, "m": 1,
            "e": {"a": 1, "k": [ease(start, 0, 100), {"t": start + dur}]}}


def layer(ind, name, items, op=OP):
    return {"ddd": 0, "ind": ind, "ty": 4, "nm": name, "sr": 1, "ip": 0, "op": op, "st": 0, "bm": 0,
            "ks": {"o": {"a": 0, "k": 100}, "r": {"a": 0, "k": 0}, "p": {"a": 0, "k": [(1 + M) * S, (M - 18) * S, 0]},
                   "a": {"a": 0, "k": [0, 0, 0]}, "s": {"a": 0, "k": [S * 100, S * 100, 100]}},
            "shapes": [{"ty": "gr", "nm": name, "it": items + [{"ty": "tr", "p": {"a": 0, "k": [0, 0]}, "a": {"a": 0, "k": [0, 0]},
                        "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0}, "o": {"a": 0, "k": 100}}]}]}


def rgb(h):
    h = h.lstrip("#"); return [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)] + [1]


def build(stroke, dot, bg=None):
    paths = build_paths()
    timing = {"ring": (0, 34), "t-stem": (44, 26), "t-bar": (52, 18), "e": (58, 28), "l": (66, 24)}
    layers = []
    for idx, (name, v, i, o) in enumerate(paths):
        st, du = timing[name]
        items = [shape(v, i, o),
                 {"ty": "st", "c": {"a": 0, "k": rgb(stroke)}, "o": {"a": 0, "k": 100}, "w": {"a": 0, "k": 7.2}, "lc": 2, "lj": 2},
                 trim(st, du)]
        lay = layer(idx + 2, name, items)
        lay["ip"] = st  # hide round end-cap dot before the stroke starts drawing
        layers.append(lay)
    dot_items = [{"ty": "el", "p": {"a": 0, "k": [166.56, 62.44]}, "s": {"a": 0, "k": [9.2, 9.2]}},
                 {"ty": "fl", "c": {"a": 0, "k": rgb(dot)}, "o": {"a": 0, "k": 100}}]
    dl = layer(1, "dot", dot_items)
    g = dl["shapes"][0]["it"][-1]
    g["a"]["k"] = [166.56, 62.44]; g["p"]["k"] = [166.56, 62.44]
    g["s"] = {"a": 1, "k": [{"t": 32, "s": [0, 0], "e": [130, 130], "o": {"x": [0.3], "y": [0]}, "i": {"x": [0.6], "y": [1]}},
                            {"t": 40, "s": [130, 130], "e": [100, 100], "o": {"x": [0.4], "y": [0]}, "i": {"x": [0.6], "y": [1]}},
                            {"t": 46}]}
    layers.insert(0, dl)
    if bg:
        layers.append({"ddd": 0, "ind": 99, "ty": 1, "nm": "background", "sc": bg, "sw": W, "sh": H, "ip": 0, "op": OP, "st": 0,
                       "ks": {"o": {"a": 0, "k": 100}, "r": {"a": 0, "k": 0}, "p": {"a": 0, "k": [W / 2, H / 2, 0]},
                              "a": {"a": 0, "k": [W / 2, H / 2, 0]}, "s": {"a": 0, "k": [100, 100, 100]}}})
    return {"v": "5.12.2", "fr": FPS, "ip": 0, "op": OP, "w": W, "h": H, "nm": "Telo logo reveal", "ddd": 0, "assets": [], "layers": layers}


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    os.makedirs(out, exist_ok=True)
    for name, args in {"telo-logo-reveal-pine": ("#0E3A2D", "#8FD63F"), "telo-logo-reveal-bone": ("#F5F3EA", "#C9F26B")}.items():
        with open(os.path.join(out, name + ".json"), "w") as f:
            json.dump(build(*args), f, separators=(",", ":"))
        print("wrote", name)
