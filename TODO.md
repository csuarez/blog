# TODO

Improvements identified but not yet done. None are blocking.

## Head and metadata

- Add `og:site_name`, `og:locale` (`es_ES`) and `article:published_time` on posts. The data is already available in `BaseLayout.astro` and the post layout.
- Add `og:image:alt` so social cards carry alt text.
- Replace the fallback OG image for home and about (currently the 512px square app icon) with a proper 1200x630 card, either a static one or one rendered by `src/pages/og/`.
- Change viewport to `width=device-width, initial-scale=1`.
- Add a `theme-color` meta matching the palette, and fill in `name`, `short_name` and `theme_color` in `public/site.webmanifest`.

## Dependencies

- Self-host the two Google Fonts (Slabo 27px, Ultra). Ultra is already in `src/fonts/` for the OG generator. This removes the only third-party request the site makes and the render-blocking `@import` in `global.css`.
- `npm audit` reports a moderate issue in `fflate`, a nested dependency of `satori` used only at build time. Clears whenever satori updates its dependency; no action needed otherwise.
