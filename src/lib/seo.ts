export const SITE_URL = "https://zexovadigital.online";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const SITE_LOGO = `${SITE_URL}/logo.png`;

export const seo = (
  title: string,
  description: string,
  image = DEFAULT_OG_IMAGE,
) => ({
  meta: [
    { title: `${title} | ZEXOVA DIGITAL` },
    { name: "description", content: description },
    { property: "og:site_name", content: "ZEXOVA DIGITAL" },
    { property: "og:title", content: `${title} | ZEXOVA DIGITAL` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: SITE_URL },
    { property: "og:image", content: image },
    { property: "og:image:secure_url", content: image },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: `${title} | ZEXOVA DIGITAL` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${title} | ZEXOVA DIGITAL` },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ],
});
