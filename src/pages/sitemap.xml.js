import { getCollection } from 'astro:content';
import { DEVLOG } from '../consts';

export async function GET(context) {
  const posts = await getCollection("blog");

  const paths = [
    "/",
    "/about/",
    DEVLOG.url,
    ...posts.map((post) => `/${post.id}/`),
  ];

  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, context.site)}</loc></url>`)
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
}
