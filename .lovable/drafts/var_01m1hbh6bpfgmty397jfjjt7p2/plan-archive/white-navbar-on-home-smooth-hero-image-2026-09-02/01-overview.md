# White navbar on home + smooth hero image

Two small fixes, no layout or content changes.

## 1. White navbar on the homepage only

The header is one shared component used by both pages. It gets a variant:

- Homepage: white bar, thin light bottom border, dark navy logo and links, hover to full navy.
- About page: unchanged (dark navy translucent bar, white text).

Same layout, same links, same hover lift and reduced-motion behaviour on both.

## 2. Hero background image jump on first scroll

Today the hero image plays a slow zoom-out on load, and the scroll parallax is a
separate animation that starts from its own value. When you begin scrolling, the
image snaps to that value — the glitch you see.

Fix: the scroll parallax is created only once the load zoom has settled, and it
starts from exactly where the image already is, so the first scroll continues
smoothly from that position instead of jumping. Only vertical drift follows the
scroll; the zoom level stays where the intro left it.

Reduced-motion users keep the current static image.
