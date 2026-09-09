"""Cut the white ground out of the SSLCommerz payment banner.

SSLCommerz only ship light-background artwork, but the footer it sits in is
dark. Keying out white globally would hollow out the tiles themselves — every
card is a white rounded rectangle. So the ground is removed by flooding INWARD
from the image edges: the fill travels through the gaps between tiles but
cannot cross a tile's border, and the white inside each tile survives.

Anything drawn straight onto that ground rather than inside a tile — the two
wording labels and the two divider rules — is dark ink that would vanish
against a dark footer. Outside the tile field those pixels are inverted to
white, alpha carrying the original darkness so the anti-aliasing survives.

Run it when SSLCommerz issue new artwork:

    python tools/cutout_payment_banner.py <source image>

The coordinates below are measured for the 1280x143 two-row banner. A different
variant needs them re-measured ON THE FULL-SIZE FILE — taken off a downscaled
copy they land in the wrong place and slice through the tiles.

Requires Pillow; it is not a project dependency, so `pip install pillow` first.
"""

import sys
from collections import deque
from pathlib import Path

from PIL import Image

ASSETS = Path(__file__).resolve().parent.parent / "src" / "assets"
DEFAULT_SRC = ASSETS / "sslcommerz-payment-banner-source.jpg"
OUT = ASSETS / "sslcommerz-payment-banner.webp"

# The tile field is everything between the two divider rules; outside it is
# wording. See the module docstring before changing these.
TILE_X0, TILE_X1 = 80, 1146

# The SSLCOMMERZ wordmark: a blue plate with the name knocked out white. It
# sits outside the tile field, so the inversion below would swap those two and
# hand back a corrupted brand mark. Its own footprint, measured from where the
# blue actually is, is what stays opaque — padded by a pixel for the rounded
# corners' anti-aliasing, and no more, or the white ground around it survives
# as a plate on the dark footer.
MARK_X0, MARK_X1 = 1168, 1264
MARK_Y0, MARK_Y1 = 69, 86

# Ground is "near enough to white". Kept high so a pale tile border still
# stops the fill — the failure mode of a loose threshold is a hollowed tile.
GROUND = 249


def main():
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
    if not src.exists():
        raise SystemExit(f"no source image at {src}")
    im = Image.open(src).convert("RGB")
    W, H = im.size
    px = im.load()

    def is_ground(x, y):
        r, g, b = px[x, y]
        return r >= GROUND and g >= GROUND and b >= GROUND

    # ── Flood the ground inward from every edge pixel ──
    outside = bytearray(W * H)
    q = deque()

    def push(x, y):
        i = y * W + x
        if not outside[i] and is_ground(x, y):
            outside[i] = 1
            q.append((x, y))

    for x in range(W):
        push(x, 0)
        push(x, H - 1)
    for y in range(H):
        push(0, y)
        push(W - 1, y)

    while q:
        x, y = q.popleft()
        if x > 0:
            push(x - 1, y)
        if x < W - 1:
            push(x + 1, y)
        if y > 0:
            push(x, y - 1)
        if y < H - 1:
            push(x, y + 1)

    # ── Build the RGBA result ──
    out = Image.new("RGBA", (W, H))
    op = out.load()
    for y in range(H):
        for x in range(W):
            i = y * W + x
            r, g, b = px[x, y]
            in_mark = MARK_X0 <= x <= MARK_X1 and MARK_Y0 <= y <= MARK_Y1
            if in_mark:
                # The wordmark is a solid blue plate with the name knocked out
                # white. Its alpha cannot come from the flood fill (JPEG
                # ringing leaves a near-white fringe the fill will not cross,
                # which reads as a halo) nor from distance-to-white (that
                # erases the knocked-out letters). Its own footprint is the
                # only honest mask: opaque inside it, and the surrounding
                # "Verified By" wording falls through to the invert below.
                op[x, y] = (r, g, b, 255)
            elif outside[i]:
                op[x, y] = (255, 255, 255, 0)
            elif TILE_X0 <= x <= TILE_X1:
                # Inside the tile field: the artwork is the artwork.
                op[x, y] = (r, g, b, 255)
            else:
                # Wording and rules: invert dark ink to white, keeping the
                # anti-aliasing as alpha so edges stay smooth.
                lum = (r * 299 + g * 587 + b * 114) // 1000
                op[x, y] = (255, 255, 255, max(0, 255 - lum))

    # WebP with alpha: a fifth of the PNG at this size, and smaller than the
    # opaque JPEG it replaces.
    out.save(OUT, "WEBP", quality=88, method=6)
    kept = sum(1 for v in outside if v)
    print(f"{W}x{H}  ground removed: {kept} px ({kept * 100 // (W * H)}%)")
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")
    print("Check the result on a dark background before shipping: a tile whose")
    print("border the fill leaked through comes out hollow.")


if __name__ == "__main__":
    main()
