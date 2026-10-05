# tharandur.sbs

Personal blog in Spanish, built with Astro as a fully static site and deployed on Netlify (no `netlify.toml`; Netlify runs `npm run build` and publishes `dist/`). Node version is pinned in `.nvmrc`.

## Philosophy

Lean. The site is the content: markdown posts, a handful of Astro components, pure CSS. Every feature is weighed against the dependency and complexity it adds, and the default answer is to do it with what Astro and the browser already provide. Ask before adding any dependency.

- No CSS frameworks, no utility classes, no CSS-in-JS. Styles are plain `.css` files with custom properties.
- No client-side JavaScript framework. Pages are static HTML.
- The only build-time extras are `satori`, `satori-html`, `@resvg/resvg-js` and `sharp`, used solely by `src/pages/og/` to render Open Graph PNGs for each post.

## Commits

Subject line only, lowercase, starting with an imperative verb: `add mixtape post`, `fix date sorting`, `adjust blockquote styling`. No body, no trailers, no `Co-Authored-By` line.

## Content

- Posts live in `src/posts/*.md`, one file per post. The filename is the URL slug (`/odio-mixtape/`), served by `src/pages/[...slug].astro`.
- Frontmatter is `title`, `pubDate`, `description` and an optional `tags` array, validated by the schema in `src/content.config.js`. Add a field there before using it in a post.
- The devlog for The Long Way Round is not a separate collection. A post with `tags: ['the-long-way-round']` is listed on `/the-long-way-round/` (`src/pages/the-long-way-round/index.astro`), gets a `devlog` label on the home list and a back link in its date line. The tag, title and URL live in `DEVLOG` in `src/consts.js`. The index intro is `src/posts/_the-long-way-round.md`, kept out of the collection by the leading underscore.
- Post images go in `src/images/` and are referenced from markdown as `../images/name.jpg`. Each post gets a generated Open Graph card at `/og/<slug>.png` whose background is the first image in the body, so lead with the image you want shared.
- Prose, UI strings and `alt` text are Spanish. Code, comments and commits are English.

## Styling

- Design tokens (spacing, colors, type scale, fonts) are custom properties on `:root` in `src/styles/global.css`. Use them instead of literal values.
- Mobile first. The single breakpoint is `@media screen and (min-width: 768px)`.
- Class naming is BEM-ish: `block__element` (`.welcome__avatar`, `.blog-post__title`). CSS nesting is used freely.
- One stylesheet per component in `src/styles/`, imported from the component. A `<style>` block inside an `.astro` file is only for rules that belong to that file alone.
- Fonts are Google Fonts (Slabo 27px for body, Ultra for headings), loaded from `global.css`.

## Backlog

Pending improvements are listed in `TODO.md`. Check it before proposing new work on metadata, fonts or dependencies.
