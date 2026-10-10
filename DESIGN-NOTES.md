# Reference analysis and implementation decisions

## What the files show

The screenshot contains three narrow white invitation layouts on a dark forest-green presentation background. The recording runs about 15.4 seconds at 320×522 and shows the invitation scrolling inside a phone mockup. The green exterior, phone hardware, browser controls, playback overlays, and presentation columns are demonstration framing, not website components.

The invitation itself uses dark olive text, tightly composed uppercase serif headlines, fine handwritten names, white botanical flowers with olive foliage, slender rules, pill buttons, photographs dissolving into white, rounded lower image corners, a minimal countdown, a vertically spaced celebration timeline, venue directions, attire references, and a bordered RSVP response card.

Visible sample content includes James & Claire, May 21, 2027, Golden Oak Gardens, and Santa Barbara. Additional schedule times and story copy in the implementation are editable demonstration content, not verified personal history.

## Translation to the web

- White paper remains the primary surface; olive is used for lettering and actions.
- Mobile retains the narrow invitation rhythm and central hierarchy. Desktop uses restrained two-column compositions to avoid stretching low-resolution images across the full viewport.
- The hero pairs “Save the Date” and handwritten names with the reference couple crop. Image masking preserves the soft white transition and rounded lower shape.
- The reference's timeline, garden venue, attire cards, response card and botanical thank-you close remain recognisable components.
- Our Story and an interactive editorial gallery extend the reference to satisfy the requested sections without introducing an unrelated visual style.
- The source recording demonstrates scrolling rather than a complex transition system. Native reveals and a small desktop parallax effect provide subtle motion, with reduced-motion opt-out.
- The recorded phone/browser UI is never used as a website background. An optional clean wedding-video path is supported.

## Limits

The original fonts cannot be identified conclusively from the supplied pixels. Bundled Bodoni Moda, Cormorant Garamond, and Italianno approximate the contrasting display, body, and script roles. Exact font matching requires the original template assets.

Reference image crops are intentionally retained rather than substituted with stock. They remain low-resolution and should be replaced with original photos for a sharp production result. The source archive includes the untouched screenshot and MOV for comparison.

Live RSVP delivery requires a configured HTTPS destination. A missing destination produces a clear failure state, never a simulated success. Deployment configuration is included; no Vercel account deployment has been performed.
