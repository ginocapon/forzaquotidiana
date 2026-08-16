/**
 * Render HTML articolo diario da JSON generato
 */
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "../scripts/lib/editorial-utils.mjs";

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escJson(s) {
  return JSON.stringify(s);
}

export function renderDiarioHtml(article, item, paths, publishDate) {
  const slug = item.slug;
  const base = `https://forzaquotidiana.it/diario/${slug}/`;
  const fiction = item.fiction !== false;
  const section = fiction ? "Goliardia" : "Riflessione";
  const typeClass = fiction ? "entry__type--goliardia" : "entry__type--rif";
  const heroUrl = `/${paths.hero}`;
  const heroFile = paths.hero.split("/").pop();

  const bodySections = (article.sections || [])
    .map((sec) => {
      let html = `<h2>${esc(sec.h2)}</h2>\n`;
      for (const p of sec.paragraphs || []) html += `    <p>${p}</p>\n`;
      if (sec.h3) {
        for (const sub of sec.h3) {
          html += `    <h3>${esc(sub.title)}</h3>\n`;
          for (const p of sub.paragraphs || []) html += `    <p>${p}</p>\n`;
        }
      }
      return html;
    })
    .join("\n");

  const figures = (article.figures || []).map((fig, i) => {
    const rel = paths.figures?.[i] || paths.figures?.[0];
    if (!rel) return "";
    return `
    <figure class="article-figure">
      <span class="ai-photo-wrap">
        <img src="/${rel}" alt="${esc(fig.alt)}" width="1200" height="800" loading="lazy" data-ai="generated">
        <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
      </span>
      <figcaption>${esc(fig.caption)} · <span class="fig-credit"><span class="ai-badge" aria-hidden="true">IA</span> Immagine elaborata / scena di finzione · <a href="/trasparenza-ai/">Trasparenza</a></span></figcaption>
    </figure>`;
  }).join("\n");

  const faqHtml = (article.faq || [])
    .map(
      (f) => `      <details>
        <summary>${esc(f.q)}</summary>
        <p>${f.a}</p>
      </details>`
    )
    .join("\n");

  const faqLd = (article.faq || []).map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, "") },
  }));

  const imagesLd = [
    `https://forzaquotidiana.it/${paths.hero}`,
    ...(paths.figures || []).map((f) => `https://forzaquotidiana.it/${f}`),
  ];

  const banner = fiction
    ? fs.readFileSync(path.join(REPO_ROOT, "templates/partials/banner-goliardia.html"), "utf8")
    : "";

  const newsletter = fs
    .readFileSync(path.join(REPO_ROOT, "templates/partials/newsletter-cta-diario.html"), "utf8")
    .replace(/SLUG_PLACEHOLDER/g, slug);

  const modified = `${publishDate}T08:00:00+02:00`;

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>${esc(article.title)}</title>
<meta name="description" content="${esc(article.meta_description)}">
<link rel="canonical" href="${base}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="La Forza Quotidiana">
<meta property="og:locale" content="it_IT">
<meta property="og:url" content="${base}">
<meta property="og:title" content="${esc(article.og_title || article.title)}">
<meta property="og:description" content="${esc(article.meta_description)}">
<meta property="og:image" content="https://forzaquotidiana.it/${paths.hero}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(article.og_title || article.title)}">
<meta name="twitter:description" content="${esc(article.meta_description)}">
<meta name="twitter:image" content="https://forzaquotidiana.it/${paths.hero}">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Home","item":"https://forzaquotidiana.it/"},
{"@type":"ListItem","position":2,"name":"Diario","item":"https://forzaquotidiana.it/diario/"},
{"@type":"ListItem","position":3,"name":${escJson(article.breadcrumb || article.h1)},"item":"${base}"}]}
</script>
<link rel="stylesheet" href="/css/styles.css?v=59">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "headline": ${escJson(article.h1)},
      "datePublished": "${publishDate}",
      "dateModified": "${modified}",
      "author": { "@type": "Person", "name": "Gino Capon", "url": "https://forzaquotidiana.it/chi-sono/" },
      "publisher": { "@type": "Organization", "name": "La Forza Quotidiana" },
      "mainEntityOfPage": "${base}",
      "inLanguage": "it-IT",
      "articleSection": "${section}",
      "image": ${JSON.stringify(imagesLd)}
    },
    {
      "@type": "FAQPage",
      "mainEntity": ${JSON.stringify(faqLd)}
    }
  ]
}
</script>
</head>
<body class="theme-diario">
<a class="skip-link" href="#contenuto">Vai al contenuto</a>
<header class="site-header">
  <div class="wrap">
    <a class="logo" href="/">La Forza Quotidiana<small>Gino Capon</small></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-principale">Menu</button>
    <nav class="site-nav" id="nav-principale" aria-label="Principale">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/chi-sono/">Chi sono</a></li>
        <li><a href="/diario/" aria-current="page">Diario</a></li>
        <li><a href="/allenamenti/">Allenamenti</a></li>
      </ul>
    </nav>
  </div>
</header>

<main id="contenuto" class="section page-veiled">
  <div class="wrap prose">
    <p class="entry__meta"><span class="entry__type ${typeClass}">${section}</span> · <time datetime="${publishDate}">${publishDate}</time></p>
    <h1>${esc(article.h1)}</h1>

    ${banner}
    <div class="article-lead">
      <p><strong>${esc(article.aeo_label || "Risposta breve")}.</strong> ${article.aeo_lead}</p>
    </div>

    <figure class="article-figure article-figure--hero">
      <span class="ai-photo-wrap">
        <img src="/${paths.hero}" alt="${esc(article.hero_alt)}" width="1600" height="760" loading="eager" data-ai="generated">
        <span class="ai-photo-mark" aria-hidden="true">Foto AI</span>
      </span>
      <figcaption>${esc(article.hero_caption)} · <span class="fig-credit"><span class="ai-badge" aria-hidden="true">IA</span> Immagine generata o abbellita con intelligenza artificiale · <a href="/trasparenza-ai/">Trasparenza</a></span></figcaption>
    </figure>

    ${bodySections}
    ${figures}

    <div class="faq">
      <h2>Domande frequenti</h2>
${faqHtml}
    </div>

    ${newsletter}

    <aside class="article-author">
      <p><strong>Gino Capon</strong> · 57 anni · si allena da oltre dieci anni come dilettante autentico. <a href="/chi-sono/">Chi sono</a> · <a href="/diario/">Diario</a> · <a href="/allenamenti/">Allenamenti</a> · <a href="/allenamenti/newsletter/">Newsletter</a></p>
    </aside>

    <aside class="disclaimer">
      <p>${fiction ? "Contenuto goliardico e riflessione personale, non consulenza medica né nutrizionale." : "Riflessione personale, non consulenza medica."} Per salute e allenamento consulta professionisti qualificati.</p>
    </aside>

    <p><a href="/diario/">← Torna al Diario</a></p>
    <p><small>Ultimo aggiornamento: ${publishDate} · Autore: <a href="/chi-sono/">Gino Capon</a></small></p>
  </div>
</main>

<footer class="site-footer">
  <div class="wrap">
    <p><small>© Gino Capon · <a href="/privacy/">Privacy</a> · <a href="/trasparenza-ai/">Trasparenza AI</a></small></p>
  </div>
</footer>
<script src="/js/main.js?v=1" defer></script>
<script src="/js/cookie-consent.js?v=4" defer></script>
<script src="/js/newsletter.js?v=5" defer></script>
</body>
</html>
`;
}
