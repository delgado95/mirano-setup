#!/usr/bin/env node
/*
 * GERADOR DO SITE DA MIRANO SETUP
 *
 * Uso:   node build.js
 *        SITE_URL=https://seudominio.com.br node build.js
 *
 * Lê:    src/index.html (modelo), pacotes.js (catálogo), ilustracoes.js (desenhos)
 * Gera:  index.html, pacotes/<id>.html, sitemap.xml, robots.txt, site.webmanifest
 *
 * Edite sempre src/index.html e pacotes.js, nunca o index.html gerado.
 * Rode este script de novo depois de qualquer mudança.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// Domínio final do site, sem barra no fim. É usado no Google, no sitemap e nos links de compartilhamento.
const SITE_URL = (process.env.SITE_URL || "https://delgado95.github.io/mirano-setup").replace(/\/+$/, "");
const MARCA = "Mirano Setup";
const OG_IMAGE = SITE_URL + "/assets/og-image.png";

const ROOT = __dirname;
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true }); fs.writeFileSync(path.join(ROOT, f), s); console.log("  gerado  " + f); };

// Carrega os dados do catálogo e das ilustrações
const ctx = { document: { querySelectorAll: () => [] } };
vm.createContext(ctx);
for (const f of ["pacotes.js", "ilustracoes.js"]) vm.runInContext(read(f), ctx, { filename: f });
const { AREAS, PACOTES, ilustra } = ctx;

// Utilitários
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(/ /g, " ");
const minusc = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const hoje = new Date().toISOString().slice(0, 10);
const jsonld = (obj) => '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, "\\u003c") + "</script>";
const PLAY = '<svg aria-hidden="true"><use href="#i-play"/></svg>';
const urlPacote = (p) => `${SITE_URL}/pacotes/${p.id}.html`;
const descPacote = (p) => `30 vídeos educativos sobre ${minusc(p.nome)} para ${AREAS[p.area].publico}. Formato Reels, sem marca d'água e com legendas prontas. Pagamento único de ${brl(p.preco)}.`;

// Confere o catálogo antes de gerar
const ids = new Set();
for (const p of PACOTES) {
  if (!/^[a-z0-9-]+$/.test(p.id)) throw new Error(`id inválido em pacotes.js: "${p.id}". Use só letras minúsculas, números e hífen.`);
  if (ids.has(p.id)) throw new Error(`id repetido em pacotes.js: "${p.id}"`);
  if (!AREAS[p.area]) throw new Error(`área desconhecida "${p.area}" no pacote "${p.id}"`);
  ids.add(p.id);
}

// Card de pacote. base = "" na página inicial, "../" dentro de /pacotes
function card(p, base) {
  const a = AREAS[p.area];
  const i = PACOTES.indexOf(p);
  const buy = p.link
    ? `<a class="btn btn-gold" href="${esc(p.link)}" target="_blank" rel="noopener" aria-label="Comprar pacote ${esc(p.nome)}">Comprar</a>`
    : `<a class="btn btn-gold" href="${base}checkout.html#${p.id}" rel="nofollow" aria-label="Comprar pacote ${esc(p.nome)}">Comprar</a>`;
  return `      <article class="pack" data-area="${p.area}" data-busca="${esc(norm([p.nome, a.nome, a.publico].concat(p.exemplos).join(" ")))}">
        <div class="pack-cover ${i % 2 ? "art-alt" : "art"}">${ilustra(p.id, "ilu")}<span class="area">${esc(a.nome)}</span><span class="count">30 vídeos</span><h3><a href="${base}pacotes/${p.id}.html">${esc(p.nome)}</a></h3></div>
        <div class="pack-body">
          <ul class="samples">${p.exemplos.map((e) => `<li>${PLAY}${esc(e)}</li>`).join("")}<li>${PLAY}e mais 27 vídeos</li></ul>
          <div class="pack-foot"><div class="pack-price"><small>pagamento único</small><strong>${brl(p.preco)}</strong></div>${buy}</div>
        </div>
      </article>`;
}

function seoTags({ title, description, url, type }) {
  return [
    `<link rel="canonical" href="${url}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large">`,
    `<meta property="og:type" content="${type || "website"}">`,
    `<meta property="og:site_name" content="${MARCA}">`,
    `<meta property="og:locale" content="pt_BR">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${OG_IMAGE}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${MARCA}: pacotes de vídeos para profissionais de saúde">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    `<meta name="twitter:image" content="${OG_IMAGE}">`
  ].join("\n");
}

const organizacao = {
  "@type": "Organization",
  "@id": SITE_URL + "/#organizacao",
  name: MARCA,
  url: SITE_URL + "/",
  logo: SITE_URL + "/assets/icon-512.png"
};

const produto = (p) => ({
  "@type": "Product",
  "@id": urlPacote(p) + "#produto",
  name: `Pacote ${p.nome}: 30 vídeos`,
  description: descPacote(p),
  image: OG_IMAGE,
  category: AREAS[p.area].nome,
  brand: { "@id": organizacao["@id"] },
  offers: {
    "@type": "Offer",
    url: urlPacote(p),
    price: p.preco.toFixed(2),
    priceCurrency: "BRL",
    availability: "https://schema.org/InStock"
  }
});

// ---------- Página inicial ----------
const src = read("src/index.html");
const title = (src.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
const description = (src.match(/<meta name="description" content="([^"]*)"/) || [])[1];

// Perguntas frequentes direto do HTML, para o FAQ estruturado
const faq = [...src.matchAll(/<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g)].map((m) => ({
  "@type": "Question",
  name: m[1].trim(),
  acceptedAnswer: { "@type": "Answer", text: m[2].trim() }
}));

const areasUsadas = Object.keys(AREAS).filter((k) => PACOTES.some((p) => p.area === k));

const filtros = ['<button class="filter" type="button" data-area="todas" aria-pressed="true">Todos</button>']
  .concat(areasUsadas.map((k) => `<button class="filter" type="button" data-area="${k}" aria-pressed="false">${esc(AREAS[k].nome)}</button>`))
  .join("");

const publico = areasUsadas.map((k) => {
  const a = AREAS[k];
  const lista = PACOTES.filter((p) => p.area === k);
  const quem = a.publico.charAt(0).toUpperCase() + a.publico.slice(1);
  return `      <div class="who-item">
        <h3>${esc(quem)}</h3>
        <p>Vídeos de ${esc(a.nome.toLowerCase())} para explicar ao paciente o que ele mais pergunta.</p>
        <nav aria-label="Pacotes de ${esc(a.nome)}">${lista.map((p) => `<a href="pacotes/${p.id}.html">${esc(p.nome)}</a>`).join("")}</nav>
      </div>`;
}).join("\n");

const indexLd = jsonld({
  "@context": "https://schema.org",
  "@graph": [
    organizacao,
    { "@type": "WebSite", "@id": SITE_URL + "/#site", url: SITE_URL + "/", name: MARCA, inLanguage: "pt-BR", publisher: { "@id": organizacao["@id"] } },
    {
      "@type": "ItemList",
      name: "Pacotes de vídeos",
      itemListElement: PACOTES.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: urlPacote(p), name: `Pacote ${p.nome}` }))
    },
    { "@type": "FAQPage", mainEntity: faq }
  ]
});

let index = src
  .replace("{{SEO}}", seoTags({ title, description, url: SITE_URL + "/" }) + "\n" + indexLd)
  .replace("{{PRECO_MIN}}", brl(Math.min(...PACOTES.map((p) => p.preco))))
  .replace("{{FILTROS}}", filtros)
  .replace("{{CATALOGO}}", PACOTES.map((p) => card(p, "")).join("\n"))
  .replace("{{PUBLICO}}", publico)
  // Desenhos dos elementos marcados com data-ilu="id"
  .replace(/(<[^>]*?)\sdata-ilu="([^"]+)"([^>]*>)/g, (m, a, id, b) => a + b + ilustra(id, "ilu"));

const sobrou = index.match(/\{\{[A-Z_]+\}\}/);
if (sobrou) throw new Error("Marcador não preenchido em src/index.html: " + sobrou[0]);

index = "<!-- Arquivo gerado por build.js a partir de src/index.html. Não edite aqui. -->\n" + index;
write("index.html", index);

// ---------- Páginas dos pacotes ----------
const estilo = src.match(/<style>[\s\S]*?<\/style>/)[0];
const sprite = src.match(/<svg width="0" height="0"[\s\S]*?\n<\/svg>/)[0];

const estiloPacote = `<style>
.crumbs { display: flex; flex-wrap: wrap; gap: 8px; color: var(--muted); font-size: .9rem; margin: 0 0 28px; padding: 0; list-style: none; }
.crumbs li + li::before { content: "/"; margin-right: 8px; color: var(--line-2); }
.crumbs a { text-decoration: none; }
.crumbs a:hover { color: var(--fg); }
.pk-hero .wrap { display: grid; grid-template-columns: 1.1fr .9fr; gap: 48px; align-items: center; }
.pk-copy { display: grid; gap: 22px; min-width: 0; }
.pk-cover { position: relative; border-radius: 20px; border: 1px solid var(--line-2); min-height: 380px; overflow: hidden; display: grid; place-items: center; }
.pk-cover .ilu { width: min(240px, 70%); height: auto; aspect-ratio: 1; color: var(--gold-hi); }
.pk-cover .count { position: absolute; left: 20px; top: 18px; font-size: .8rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--gold-hi); }
.pk-cover .dur { position: absolute; right: 20px; bottom: 18px; font-size: .9rem; color: #D5DCDF; }
.ex-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.ex-list li { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 20px; display: grid; gap: 8px; }
.ex-list li span { color: var(--gold); font-weight: 700; font-size: .85rem; font-variant-numeric: tabular-nums; }
.ex-list li strong { font-size: 1.05rem; line-height: 1.3; }
.ex-more { margin-top: 14px; color: var(--muted); }
@media (max-width: 900px) { .pk-hero .wrap { grid-template-columns: 1fr; } .pk-cover { min-height: 300px; } .ex-list { grid-template-columns: 1fr; } }
</style>`;

const cabecalho = (base) => `<header class="band">
  <div class="wrap">
    <a class="brand" href="${base}index.html" aria-label="${MARCA}, página inicial">
      <svg aria-hidden="true"><use href="#logo"/></svg>
      <span class="wordmark"><b>MIRANO</b><span>SETUP</span></span>
    </a>
    <nav class="main" aria-label="Seções">
      <a href="${base}index.html#pacotes">Pacotes</a>
      <a href="${base}index.html#para-quem">Para quem é</a>
      <a href="${base}index.html#duvidas">Dúvidas</a>
    </nav>
    <a class="btn btn-gold" href="${base}index.html#pacotes">Ver pacotes</a>
  </div>
</header>`;

const rodape = (base) => `<footer class="band">
  <div class="wrap">
    <a class="brand" href="${base}index.html"><svg aria-hidden="true"><use href="#logo"/></svg><span class="wordmark"><b>MIRANO</b><span>SETUP</span></span></a>
    <span>© ${new Date().getFullYear()} ${MARCA}</span>
  </div>
</footer>`;

for (const p of PACOTES) {
  const a = AREAS[p.area];
  const t = `Pacote ${p.nome}: 30 vídeos prontos para postar | ${MARCA}`;
  const d = descPacote(p);
  const url = urlPacote(p);
  const mesmos = PACOTES.filter((x) => x.area === p.area && x.id !== p.id);
  const relacionados = (mesmos.length ? mesmos : PACOTES.filter((x) => x.id !== p.id)).slice(0, 3);
  const buy = p.link
    ? `<a class="btn btn-gold" href="${esc(p.link)}" target="_blank" rel="noopener">Comprar por ${brl(p.preco)}</a>`
    : `<a class="btn btn-gold" href="../checkout.html#${p.id}" rel="nofollow">Comprar por ${brl(p.preco)}</a>`;

  const ld = jsonld({
    "@context": "https://schema.org",
    "@graph": [
      organizacao,
      produto(p),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL + "/" },
          { "@type": "ListItem", position: 2, name: a.nome, item: SITE_URL + "/#pacotes" },
          { "@type": "ListItem", position: 3, name: `Pacote ${p.nome}`, item: url }
        ]
      }
    ]
  });

  const html = `<!doctype html>
<!-- Arquivo gerado por build.js. Não edite aqui: mude pacotes.js e rode node build.js. -->
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(d)}">
${seoTags({ title: t, description: d, url, type: "product" })}
${ld}
<meta name="theme-color" content="#061219">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="../assets/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
<link rel="manifest" href="../site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap">
${estilo}
${estiloPacote}
</head>
<body>
${sprite}

${cabecalho("../")}

<main>
<section class="band hero pk-hero">
  <div class="wrap">
    <div class="pk-copy">
      <nav aria-label="Você está em">
        <ol class="crumbs">
          <li><a href="../index.html">Início</a></li>
          <li><a href="../index.html#pacotes">${esc(a.nome)}</a></li>
          <li aria-current="page">${esc(p.nome)}</li>
        </ol>
      </nav>
      <span class="label">${esc(a.nome)} · 30 vídeos</span>
      <h1>Pacote ${esc(p.nome)}: <span class="gold">30 vídeos prontos para postar</span></h1>
      <p class="lead">Vídeos educativos sobre ${esc(minusc(p.nome))} para ${esc(a.publico)}. Você paga uma vez, recebe o acesso no e-mail e publica no seu Instagram profissional.</p>
      <div class="buy-row">${buy}</div>
      <div class="facts">
        <span><svg aria-hidden="true"><use href="#i-check"/></svg>Vertical 9:16</span>
        <span><svg aria-hidden="true"><use href="#i-check"/></svg>Sem marca d'água</span>
        <span><svg aria-hidden="true"><use href="#i-check"/></svg>Legendas prontas</span>
        <span><svg aria-hidden="true"><use href="#i-check"/></svg>Garantia de 7 dias</span>
      </div>
    </div>
    <div class="pk-cover ${PACOTES.indexOf(p) % 2 ? "art-alt" : "art"}" aria-hidden="true">
      <span class="count">30 vídeos</span>
      ${ilustra(p.id, "ilu")}
      <span class="dur">20 a 60 segundos cada</span>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="ex-t" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="ex-t">Alguns dos vídeos do pacote ${esc(p.nome)}</h2>
    </div>
    <ul class="ex-list">
${p.exemplos.map((e, i) => `      <li><span>Vídeo ${String(i + 1).padStart(2, "0")}</span><strong>${esc(e)}</strong></li>`).join("\n")}
    </ul>
    <p class="ex-more">E mais 27 vídeos sobre ${esc(minusc(p.nome))}, sem repetir assunto.</p>
  </div>
</section>

<section class="band" aria-labelledby="in-t" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head"><h2 id="in-t">O que vem no pacote</h2></div>
    <div class="inside">
      <div><strong>30</strong><span>vídeos sobre ${esc(minusc(p.nome))}</span></div>
      <div><strong>9:16</strong><span>formato vertical para Reels, TikTok e Shorts</span></div>
      <div><strong>MP4</strong><span>sem marca d'água e com legenda embutida</span></div>
      <div><strong>30</strong><span>textos de legenda prontos, um para cada vídeo</span></div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="rel-t" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head"><h2 id="rel-t">${mesmos.length ? "Outros pacotes de " + esc(a.nome) : "Outros pacotes"}</h2></div>
    <div class="packs">
${relacionados.map((x) => card(x, "../")).join("\n")}
    </div>
  </div>
</section>
</main>

${rodape("../")}
</body>
</html>
`;
  write(`pacotes/${p.id}.html`, html);
}

// Remove páginas de pacotes que saíram do catálogo
const dirPac = path.join(ROOT, "pacotes");
for (const f of fs.readdirSync(dirPac)) {
  if (f.endsWith(".html") && !ids.has(f.slice(0, -5))) { fs.unlinkSync(path.join(dirPac, f)); console.log("  removido pacotes/" + f); }
}

// ---------- sitemap, robots e manifesto ----------
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><lastmod>${hoje}</lastmod><priority>1.0</priority></url>
${PACOTES.map((p) => `  <url><loc>${urlPacote(p)}</loc><lastmod>${hoje}</lastmod><priority>0.8</priority></url>`).join("\n")}
</urlset>
`);

write("robots.txt", `User-agent: *
Allow: /
Disallow: /checkout.html
Disallow: /src/
Disallow: /ferramentas/

Sitemap: ${SITE_URL}/sitemap.xml
`);

write("site.webmanifest", JSON.stringify({
  name: MARCA,
  short_name: "Mirano",
  description: description,
  start_url: "./",
  display: "standalone",
  background_color: "#061219",
  theme_color: "#061219",
  icons: [
    { src: "assets/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "assets/icon-512.png", sizes: "512x512", type: "image/png" }
  ]
}, null, 2) + "\n");

console.log(`\nPronto. ${PACOTES.length} pacotes, domínio ${SITE_URL}`);
