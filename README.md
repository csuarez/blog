# tharandur.sbs

Source of [tharandur.sbs](https://tharandur.sbs), a personal blog in Spanish. Built with [Astro](https://astro.build) as a static site, styled with plain CSS, deployed on Netlify.

## Running it

Requires the Node version in `.nvmrc`.

```sh
npm install
npm run dev       # local server at http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/ locally
```

## Writing a post

Create a markdown file in `src/posts/`. The filename becomes the URL, so `src/posts/odio-mixtape.md` is served at `/odio-mixtape/`.

```md
---
title: 'Odio Mixtape'
pubDate: 2026-06-12
description: 'Todos mis problemas con el juego que le gusta a todo el mundo'
---

![Alt text](../images/steve-buscemi.jpg)

Body of the post.
```

Images go in `src/images/` and are referenced with a relative path. The first image in the body becomes the background of the post's social preview card. Astro optimizes images at build time.

The home page groups posts by year, newest first. An RSS feed is generated at `/rss.xml`, and an Open Graph PNG for each post at `/og/<slug>.png`.

## Layout

```
src/
├── posts/        markdown posts (the content collection)
├── images/       post images
├── pages/        routes: index, about, [slug], rss.xml, og/[slug].png
├── layouts/      BaseLayout and the post layout
├── components/   header, navigation, footer, welcome box, post summary
├── styles/       global tokens, reset, one stylesheet per component
└── fonts/        Ultra, used to render OG images
public/           favicons and web manifest, copied as-is
```

## Deploying

Netlify builds `main` on every push with `npm run build` and publishes `dist/`. There is no Netlify config in the repo; the site settings live in the Netlify dashboard.

## License

Texts are licensed under [Creative Commons BY 4.0](https://creativecommons.org/licenses/by/4.0/).
