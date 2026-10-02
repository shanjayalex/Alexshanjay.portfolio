# Design exports

Drop graphic design work here. It shows in the **Design** section and in the hero's lower tray (the first three designs).

## Image spec

- **Size:** 1080 × 1080 px (1:1, square)
- **Format:** WebP, quality ~80 (aim for under 200 KB each)
- **Naming:** `01-ax-instagram.webp`, `02-coconut-promo.webp`, … (the number sets the order)
- **Count:** 6–12 pieces works best. Cards sit in trays of three.

## Hooking an image up

Open `src/data/content.js`, find the design in `designs`, and set `image`:

```js
{
  id: "coconut-island-promo",
  title: "The Coconut Island — Weekend promo",
  category: "Restaurant",               // one of: Social Posts · Branding · Restaurant · Posters
  image: "/design/02-coconut-promo.webp",
  caption: "Promo poster for The Coconut Island restaurant.",
  href: "https://www.instagram.com/p/…/", // optional "View on Instagram ↗" link
},
```

While `image` is `null`, a typographic placeholder poster is shown instead.

## Expected slots

| Slot | File | Design |
|---|---|---|
| 01 | `01-ax-instagram.webp` | AX.Visuals Instagram post (instagram.com/p/Dd9xJcnTEEn) |
| 02 | `02-coconut-promo.webp` | The Coconut Island — weekend promo |
| 03 | `03-brand-identity.webp` | Brand identity system |
| 04 | `04-event-poster.webp` | Event poster |
| 05 | `05-coconut-menu.webp` | The Coconut Island — menu post |
| 06 | `06-social-carousel.webp` | Social carousel |
