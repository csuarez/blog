import { getCollection } from "astro:content";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

// Cache font data to avoid re-reading for each post
let fontData: ArrayBuffer | null = null;

function getFontData() {
  if (fontData) return fontData;
  const fontPath = path.join(process.cwd(), "src/fonts/Ultra-Regular.ttf");
  if (!fs.existsSync(fontPath)) {
    throw new Error(`Font file not found at ${fontPath}`);
  }
  const buffer = fs.readFileSync(fontPath);
  fontData = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  return fontData;
}

export const GET = async ({ props }: { props: any }) => {
  const { post } = props;

  // 1. Extract first image from markdown body
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = post.body?.match(imageRegex);
  let ogImageBase64 = null;

  if (match) {
    const firstImagePath = match[1];
    let imageBuffer: Buffer | null = null;

    if (firstImagePath.startsWith('../images/')) {
      const relativePath = firstImagePath.replace('../images/', 'src/images/');
      const absolutePath = path.join(process.cwd(), relativePath);
      
      if (fs.existsSync(absolutePath)) {
        imageBuffer = fs.readFileSync(absolutePath);
      }
    } else if (firstImagePath.startsWith('http')) {
      try {
        const response = await fetch(firstImagePath);
        const arrayBuffer = await response.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
      } catch (e) {
        console.error(`Failed to fetch external image: ${firstImagePath}`, e);
      }
    }

    if (imageBuffer) {
      try {
        // Resize and optimize image to avoid OOM and large SVG strings
        const resizedBuffer = await sharp(imageBuffer)
          .resize(1200, 630, { fit: 'cover' })
          .jpeg({ quality: 75 })
          .toBuffer();
        ogImageBase64 = `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`;
      } catch (e) {
        console.error(`Failed to process image with sharp: ${firstImagePath}`, e);
      }
    }
  }

  // 2. Get Font
  const font = getFontData();

  // 3. Define Markup
  // The tagged-template form escapes interpolated strings as text, so the
  // markup is assembled as a plain string and parsed in one go. Post fields
  // are escaped by hand since they land inside raw HTML.
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const markup = html(`
    <div style="height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #1d2f6f; font-family: 'Ultra'; color: #f9e9ec; position: relative;">
      ${ogImageBase64 ? `<img src="${ogImageBase64}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.3;" />` : ''}
      <div style="display: flex; flex-direction: column; align-items: flex-start; justify-content: center; width: 100%; padding: 60px;">
        <div style="font-size: 24px; margin-bottom: 20px; color: #f88dad; text-transform: uppercase;">tharandur.sbs</div>
        <div style="font-size: 72px; margin-bottom: 20px; line-height: 1.1; display: flex;">${escape(post.data.title)}</div>
        <div style="font-size: 32px; color: #fac748; display: flex;">${escape(post.data.description)}</div>
      </div>
    </div>
  `);

  // 4. Generate SVG
  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Ultra",
        data: font,
        style: "normal",
      },
    ],
  });

  // 5. Convert SVG to PNG
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
