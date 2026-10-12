# Design exports

Graphic design work shown in the **Design** section and in the hero's lower tray (the first three designs).

## Image spec

- **Any shape** — 4:5 posts and 9:16 stories both work. Cards show a 4:5 crop; the lightbox shows the whole poster.
- **Two files per design**, WebP: the full image at up to 1080 px wide (`name.webp`, quality ~82) and a 600 px card version (`name-600.webp`, quality ~78).
- Aim for under 200 KB (full) and under 70 KB (card).

## Hooking a design up

Add an entry to `designs` in `src/data/content.js`:

```js
{
  id: "coconut-island-free-fry",
  title: "The Coconut Island — Free Chickpea / Potato Fry",
  category: "Restaurant",                         // must match a name in designFilters
  image: "/design/coconut-island-free-fry.webp",  // full size (lightbox)
  thumb: "/design/coconut-island-free-fry-600.webp", // card
  width: 941, height: 1672,                       // size of the full image
  focus: "50% 22%",                               // optional: where the 4:5 card crop centres
  concept: true,                                  // optional: spec work for a brand that wasn't a client
  caption: "One line about the piece.",
  href: "https://www.instagram.com/p/…/",         // optional Instagram link
},
```

Order in the array = order on the site. Keep real client work first.
