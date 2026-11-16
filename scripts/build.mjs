// Gera o site de documentação (um único index.html autocontido) a partir de content/<idioma>/*.md
// Uso: npm run build  →  dist/index.html
// Mesmo formato da documentação do EnergCalc; idiomas = pastas existentes em content/.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LANGS = ['pt', 'en'].filter((l) => existsSync(join(ROOT, 'content', l)));
const UI = {
  pt: { search: 'Buscar na documentação…', onThisPage: 'Nesta página', prev: 'Anterior', next: 'Próxima', noResults: 'Nada encontrado', docs: 'Documentação', updated: 'Atualizado em', lang: 'English', langCode: 'EN', skip: 'Pular para o conteúdo', site: 'CondicionalMap — documentação', enlarge: 'Ampliar', close: 'Fechar' },
  en: { search: 'Search the docs…', onThisPage: 'On this page', prev: 'Previous', next: 'Next', noResults: 'No results', docs: 'Documentation', updated: 'Updated', lang: 'Português', langCode: 'PT', skip: 'Skip to content', site: 'CondicionalMap — documentation', enlarge: 'Enlarge', close: 'Close' },
};

const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const pages = {};
for (const lang of LANGS) {
  const dir = join(ROOT, 'content', lang);
  pages[lang] = readdirSync(dir).filter((f) => f.endsWith('.md')).sort().map((f) => {
    const { data, content } = matter(readFileSync(join(dir, f), 'utf8'));
    for (const k of ['slug', 'title', 'group', 'description']) if (!data[k]) throw new Error(`${lang}/${f}: falta "${k}" no cabeçalho`);
    const headings = [];
    const renderer = new marked.Renderer();
    renderer.heading = ({ tokens, depth }) => {
      const text = marked.Parser.parseInline(tokens);
      const id = `${data.slug}--${slugify(text)}`;
      if (depth === 2) headings.push({ id, text: text.replace(/<[^>]+>/g, '') });
      return depth === 1 ? `<h1>${text}</h1>` : `<h${depth} id="${id}"><a class="anchor" href="#${lang}-${data.slug}" data-scroll="${id}" aria-hidden="true">#</a>${text}</h${depth}>`;
    };
    renderer.code = ({ text, lang: l }) => (l === 'mermaid'
      ? `<div class="diagram"><pre class="mermaid">${escapeHtml(text)}</pre></div>`
      : `<pre><code>${escapeHtml(text)}</code></pre>`);
    renderer.table = function (token) { return `<div class="table-wrap">${marked.Renderer.prototype.table.call(this, token)}</div>`; };
    renderer.link = ({ href, tokens }) => {
      const text = marked.Parser.parseInline(tokens);
      const external = /^https?:/.test(href);
      return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
    };
    // > **Problema:** ... vira um bloco de solução de problemas destacado
    renderer.blockquote = ({ tokens }) => {
      const inner = marked.Parser.parse(tokens);
      const kind = /^<p><strong>(Problema|Problem)/.test(inner) ? 'issue' : /^<p><strong>(Atenção|Warning)/.test(inner) ? 'warn' : 'note';
      return `<blockquote class="${kind}">${inner}</blockquote>`;
    };
    const html = marked.parse(content, { renderer, gfm: true });
    const plain = content.replace(/```[\s\S]*?```/g, ' ').replace(/[#*`>|\-\[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
    return { slug: data.slug, title: data.title, group: data.group, description: data.description, html, headings, text: plain };
  });
}
if (LANGS.length > 1) {
  const a = pages[LANGS[0]].map((p) => p.slug).join(','), b = pages[LANGS[1]].map((p) => p.slug).join(',');
  if (a !== b) throw new Error(`Slugs diferentes entre ${LANGS[0]} e ${LANGS[1]}:\n${a}\n${b}`);
}

const data = { pages, langs: LANGS, ui: UI, updated: new Date().toISOString().slice(0, 10), version: JSON.parse(readFileSync(join(ROOT, 'package.json'))).version };
const ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2A2522"/><path fill="none" stroke="#F7F3EE" stroke-width="4" stroke-linecap="round" d="M24 24v-4a8 8 0 0 1 16 0v4"/><path fill="#B4644E" d="M17 24h30l-2.6 24.4A4 4 0 0 1 40.4 52H23.6a4 4 0 0 1-4-3.6z"/></svg>';

const html = `<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CondicionalMap — Documentação</title>
<meta name="description" content="Documentação do CondicionalMap: gestão de vendas por condicional para lojas de roupa — cada parte do sistema, casos de uso e solução de problemas.">
<meta name="theme-color" content="#F7F3EE">
<meta property="og:type" content="website"><meta property="og:site_name" content="CondicionalMap">
<meta property="og:title" content="CondicionalMap — Documentação">
<meta property="og:description" content="Como funciona o CondicionalMap: condicionais, clientes, mapa das sacolas, pagamentos e segurança.">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(ICON)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=JetBrains+Mono:wght@500&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#F7F3EE;--bg2:#FFFDFA;--bg3:#EFE8DF;--line:#E6DDD2;--text:#3A332F;--text2:#7A7069;--head:#2A2522;--accent:#B4644E;--accent2:#9A513D;--sage:#7D8A6E;--gold:#A9844A;--danger:#A8433A;--code:#F1EAE1;--shadow:0 12px 34px -14px rgba(42,37,34,.25)}
[data-theme=dark]{--bg:#1D1917;--bg2:#24201D;--bg3:#2E2825;--line:#3A332F;--text:#E9E1D9;--text2:#ADA197;--head:#F7F3EE;--accent:#E0957F;--accent2:#EBA894;--sage:#A3B194;--gold:#D5B27A;--danger:#E5877E;--code:#2A2421;--shadow:0 12px 34px -12px #000c}
*{box-sizing:border-box}html{scroll-padding-top:76px}
body{margin:0;background:var(--bg);color:var(--text);font:400 17px/1.7 "Source Sans 3",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
.skip{position:absolute;left:-999px}.skip:focus{left:12px;top:12px;z-index:99;background:var(--accent);color:#fff;padding:8px 12px;border-radius:8px}
#content:focus{outline:none}
header.top{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:14px;height:62px;padding:0 22px;background:color-mix(in srgb,var(--bg) 90%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:center;gap:10px;color:var(--head);white-space:nowrap;font:600 19px/1 "Fraunces",Georgia,serif}
.brand:hover{text-decoration:none}.brand img{width:30px;height:30px}
.doclabel{font:600 11px "Source Sans 3",sans-serif;color:var(--text2);text-transform:uppercase;letter-spacing:.12em;margin-left:-4px;white-space:nowrap}.doclabel:hover{color:var(--accent);text-decoration:none}
.brand small{font:600 11px "Source Sans 3",sans-serif;color:var(--text2);text-transform:uppercase;letter-spacing:.12em;margin-left:4px}
.search{position:relative;flex:1;min-width:0;max-width:440px;margin-left:auto}.search input{min-width:0}
.search input{width:100%;background:var(--bg2);border:1px solid var(--line);color:var(--text);border-radius:10px;padding:9px 12px 9px 36px;font:inherit;font-size:15px}
.search input:focus{outline:2px solid var(--accent);outline-offset:1px}
.search:before{content:"";position:absolute;left:13px;top:12px;width:11px;height:11px;border:2px solid var(--text2);border-radius:50%}
.search:after{content:"";position:absolute;left:24px;top:24px;width:6px;height:2px;background:var(--text2);transform:rotate(45deg)}
.results{position:absolute;top:46px;left:0;right:0;background:var(--bg2);border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow);max-height:60vh;overflow:auto;display:none}
.results.open{display:block}.results a{display:block;padding:10px 14px;border-bottom:1px solid var(--line);color:var(--text)}.results a:hover,.results a.sel{background:var(--bg3);text-decoration:none}
.results b{color:var(--head)}.results span{display:block;font-size:14px;color:var(--text2)}.results mark{background:none;color:var(--accent);font-weight:700}
.btn{background:var(--bg2);border:1px solid var(--line);color:var(--text);border-radius:10px;padding:8px 12px;font:600 13px "Source Sans 3",sans-serif;cursor:pointer;white-space:nowrap}
.btn:hover{border-color:var(--accent);color:var(--accent)}.menu-btn{display:none}
.layout{display:grid;grid-template-columns:270px minmax(0,1fr) 220px;max-width:1360px;margin:0 auto}
nav.side{position:sticky;top:62px;height:calc(100vh - 62px);overflow:auto;padding:26px 16px 40px 22px;border-right:1px solid var(--line)}
nav.side h4{margin:24px 0 6px 10px;font:700 11px "Source Sans 3",sans-serif;text-transform:uppercase;letter-spacing:.14em;color:var(--sage)}
nav.side h4:first-child{margin-top:0}
nav.side a{display:block;padding:7px 10px;border-radius:9px;color:var(--text2);font-size:15px;line-height:1.35}
nav.side a:hover{background:var(--bg3);color:var(--head);text-decoration:none}nav.side a.active{background:var(--bg2);color:var(--head);font-weight:600;box-shadow:0 1px 2px rgba(42,37,34,.06),inset 3px 0 0 var(--accent)}
main{padding:40px 52px 80px;min-width:0}
main h1{font:600 clamp(34px,4.6vw,48px)/1.08 "Fraunces",Georgia,serif;color:var(--head);margin:0 0 12px;letter-spacing:-.01em}
.lead{color:var(--text2);font-size:19px;margin:0 0 30px;padding-bottom:24px;border-bottom:1px solid var(--line)}
main h2{font:600 27px/1.2 "Fraunces",Georgia,serif;color:var(--head);margin:46px 0 12px}
main h3{font:700 19px/1.3 "Source Sans 3",sans-serif;color:var(--head);margin:30px 0 8px}
.anchor{opacity:0;margin-left:-22px;padding-right:8px;color:var(--text2)}h2:hover .anchor,h3:hover .anchor{opacity:1;text-decoration:none}
main p,main li{max-width:74ch}main strong{color:var(--head);font-weight:700}
main ul,main ol{padding-left:24px}main li{margin:5px 0}
code{font:500 .85em "JetBrains Mono",monospace;background:var(--code);border:1px solid var(--line);border-radius:6px;padding:2px 6px;color:var(--head)}
pre{background:var(--code);border:1px solid var(--line);border-radius:12px;padding:14px 16px;overflow:auto;font-size:14px}pre code{border:0;padding:0;background:none}
blockquote{margin:20px 0;padding:12px 18px;border-left:3px solid var(--sage);background:var(--bg2);border-radius:0 12px 12px 0;color:var(--text)}blockquote p{margin:5px 0}
blockquote.issue{border-left-color:var(--accent);background:color-mix(in srgb,var(--accent) 7%,var(--bg2))}
blockquote.warn{border-left-color:var(--gold);background:color-mix(in srgb,var(--gold) 9%,var(--bg2))}
.table-wrap{overflow-x:auto;margin:18px 0;border:1px solid var(--line);border-radius:12px;background:var(--bg2)}
table{border-collapse:collapse;width:100%;font-size:15px}th{background:var(--bg3);color:var(--head);text-align:left;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.05em}
th,td{padding:10px 14px;border-bottom:1px solid var(--line);vertical-align:top}tr:last-child td{border-bottom:0}
.diagram{position:relative;margin:22px 0;padding:18px;border:1px solid var(--line);border-radius:14px;background:var(--bg2);overflow-x:auto;text-align:center}
.diagram pre.mermaid{background:none;border:0;margin:0;padding:0;font:13px "JetBrains Mono",monospace;color:var(--text2);text-align:left}
.diagram pre.mermaid[data-processed]{text-align:center;font:15px "Source Sans 3",sans-serif}.diagram svg{max-width:100%;height:auto}
.zoom-btn{display:block;margin:12px auto 0;font-size:12px;padding:6px 10px}
.zoom-ov{position:fixed;inset:0;z-index:100;background:color-mix(in srgb,var(--bg) 95%,transparent);display:flex;flex-direction:column}
.zoom-bar{display:flex;gap:8px;align-items:center;justify-content:center;padding:12px;border-bottom:1px solid var(--line);background:var(--bg2)}
.zoom-pct{font:500 13px "JetBrains Mono",monospace;min-width:52px;text-align:center;color:var(--text2)}.zoom-close{margin-left:12px}
.zoom-stage{flex:1;overflow:auto;padding:24px;display:flex;align-items:flex-start;justify-content:center}
.zoom-stage svg{flex:none;background:var(--bg2);border:1px solid var(--line);border-radius:12px;padding:16px}
.pager{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:56px}
.pager a{display:block;border:1px solid var(--line);border-radius:12px;padding:14px 16px;color:var(--head);background:var(--bg2)}.pager a:hover{border-color:var(--accent);text-decoration:none}
.pager small{display:block;color:var(--text2);font:700 11px "Source Sans 3",sans-serif;text-transform:uppercase;letter-spacing:.12em}.pager .next{text-align:right;grid-column:2}
aside.toc{position:sticky;top:62px;height:calc(100vh - 62px);overflow:auto;padding:40px 20px;font-size:14px}
aside.toc h5{margin:0 0 10px;font:700 11px "Source Sans 3",sans-serif;text-transform:uppercase;letter-spacing:.14em;color:var(--text2)}
aside.toc a{display:block;padding:4px 0 4px 10px;color:var(--text2);border-left:2px solid var(--line)}aside.toc a:hover{color:var(--head);text-decoration:none}aside.toc a.on{color:var(--head);border-left-color:var(--accent)}
footer.foot{border-top:1px solid var(--line);padding:22px 52px;color:var(--text2);font-size:14px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
@media (max-width:1180px){.layout{grid-template-columns:250px minmax(0,1fr)}aside.toc{display:none}}
@media (max-width:820px){.layout{grid-template-columns:1fr}nav.side{position:fixed;top:62px;left:0;bottom:0;width:86vw;max-width:320px;height:auto;background:var(--bg);z-index:30;transform:translateX(-102%);transition:transform .2s;box-shadow:var(--shadow)}
nav.side.open{transform:none}.menu-btn{display:inline-block}main{padding:26px 18px 60px}.brand small,.doclabel{display:none}.search{max-width:none}footer.foot{padding:18px}header.top{gap:8px;padding:0 12px}.btn{min-height:40px;min-width:40px}.zoom-btn{min-height:40px}.search input{font-size:16px}}
@media (max-width:480px){.brand{font-size:0;gap:0}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
@media print{header.top,nav.side,aside.toc,.pager{display:none}.layout{display:block}}
</style>
</head>
<body>
<a class="skip" href="#content" id="skip"></a>
<header class="top">
  <button class="btn menu-btn" id="menuBtn" aria-controls="side" aria-expanded="false">☰</button>
  <a class="brand" href="/" title="Voltar ao CondicionalMap"><img alt="" src="data:image/svg+xml,${encodeURIComponent(ICON)}">CondicionalMap</a>
  <a class="doclabel" id="home" href="#"><span id="docsLabel"></span></a>
  <div class="search" role="search"><input id="q" type="search" autocomplete="off" aria-label="search"><div class="results" id="results" role="listbox"></div></div>
  <button class="btn" id="langBtn" title="Language / Idioma"></button>
  <button class="btn" id="themeBtn" aria-label="theme">◐</button>
</header>
<div class="layout">
  <nav class="side" id="side" aria-label="docs"></nav>
  <main id="content" tabindex="-1"></main>
  <aside class="toc" id="toc"></aside>
</div>
<footer class="foot"><span id="footL"></span><span id="footR"></span></footer>
<script id="docs-data" type="application/json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
<script>
(function(){
  var D = JSON.parse(document.getElementById('docs-data').textContent);
  var store = { get: function(k){ try { return localStorage.getItem(k); } catch(e) { return null; } }, set: function(k,v){ try { localStorage.setItem(k,v); } catch(e) {} } };
  var $ = function(id){ return document.getElementById(id); };
  var lang = D.langs[0], slug = 'intro', mermaidMod = null;

  var theme = store.get('cmdocs.theme') || 'light';
  document.documentElement.dataset.theme = theme;
  $('themeBtn').onclick = function(){ theme = theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; store.set('cmdocs.theme', theme); render(); };
  if (D.langs.length < 2) $('langBtn').style.display = 'none';

  function parse(){
    var h = location.hash.replace('#','');
    var m = /^([a-z]{2})-([a-z0-9-]+)$/.exec(h);
    if (m && D.langs.indexOf(m[1]) >= 0) { lang = m[1]; slug = m[2]; return; }
    var saved = store.get('cmdocs.lang');
    lang = D.langs.indexOf(saved) >= 0 ? saved : D.langs[0];
    slug = 'intro';
  }
  function ordered(l){
    var groups = [], by = {};
    D.pages[l].forEach(function(p){ if(!by[p.group]){ by[p.group]=[]; groups.push(p.group);} by[p.group].push(p); });
    var list = []; groups.forEach(function(g){ list = list.concat(by[g]); });
    return { groups: groups, by: by, list: list };
  }
  function go(l, s){ var h = '#'+l+'-'+s; if (location.hash === h) render(); else location.hash = h; }

  function render(){
    var ui = D.ui[lang], o = ordered(lang);
    var page = o.list.filter(function(p){ return p.slug === slug; })[0] || o.list[0];
    slug = page.slug;
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = page.title + ' — CondicionalMap ' + ui.docs;
    store.set('cmdocs.lang', lang);
    $('docsLabel').textContent = ui.docs; $('skip').textContent = ui.skip;
    $('langBtn').textContent = ui.langCode; $('langBtn').title = ui.lang;
    $('q').placeholder = ui.search;
    $('footL').textContent = ui.site + ' · v' + D.version;
    $('footR').textContent = ui.updated + ' ' + D.updated;
    $('side').innerHTML = o.groups.map(function(g){
      return '<h4>'+g+'</h4>' + o.by[g].map(function(p){ return '<a href="#'+lang+'-'+p.slug+'"'+(p.slug===slug?' class="active" aria-current="page"':'')+'>'+p.title+'</a>'; }).join('');
    }).join('');
    var i = o.list.indexOf(page), prev = o.list[i-1], next = o.list[i+1];
    $('content').innerHTML = page.html.replace('</h1>', '</h1><p class="lead">'+page.description+'</p>') +
      '<nav class="pager">' + (prev ? '<a href="#'+lang+'-'+prev.slug+'"><small>← '+ui.prev+'</small>'+prev.title+'</a>' : '<span></span>') +
      (next ? '<a class="next" href="#'+lang+'-'+next.slug+'"><small>'+ui.next+' →</small>'+next.title+'</a>' : '') + '</nav>';
    $('toc').innerHTML = page.headings.length ? '<h5>'+ui.onThisPage+'</h5>' + page.headings.map(function(h){ return '<a href="#'+lang+'-'+slug+'" data-scroll="'+h.id+'">'+h.text+'</a>'; }).join('') : '';
    $('side').classList.remove('open'); $('menuBtn').setAttribute('aria-expanded','false');
    drawDiagrams();
  }

  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('[data-scroll]');
    if (!a) return;
    e.preventDefault();
    var el = document.getElementById(a.getAttribute('data-scroll'));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  function drawDiagrams(){
    var nodes = Array.prototype.slice.call(document.querySelectorAll('pre.mermaid'));
    if (!nodes.length) return;
    var dark = theme === 'dark';
    var run = function(m){
      m.initialize({ startOnLoad:false, securityLevel:'strict', theme: dark ? 'dark' : 'neutral', themeVariables: { fontFamily:'Source Sans 3, sans-serif', primaryColor: dark ? '#2E2825' : '#FFFDFA', primaryBorderColor: dark ? '#E0957F' : '#B4644E', lineColor: dark ? '#ADA197' : '#7A7069', primaryTextColor: dark ? '#F7F3EE' : '#2A2522' } });
      // mede o texto com a fonte já carregada (senão os rótulos saem cortados)
      nodes.forEach(function(n){ n.style.font = '15px "Source Sans 3", sans-serif'; });
      var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      ready.then(function(){ return m.run({ nodes: nodes }); }).then(addZoomButtons).catch(function(){});
    };
    if (mermaidMod) return run(mermaidMod);
    import('https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs').then(function(mod){ mermaidMod = mod.default; run(mermaidMod); }).catch(function(){ /* sem internet: mostra o texto do diagrama */ });
  }
  function addZoomButtons(){
    Array.prototype.forEach.call(document.querySelectorAll('.diagram'), function(d){
      if (d.querySelector('.zoom-btn') || !d.querySelector('svg')) return;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn zoom-btn'; b.textContent = '⤢ ' + D.ui[lang].enlarge;
      b.onclick = function(){ openZoom(d.querySelector('svg')); };
      d.appendChild(b);
    });
  }
  function openZoom(svg){
    var vb = (svg.getAttribute('viewBox') || '').split(/\\s+/).map(Number);
    var natW = vb[2] || svg.getBoundingClientRect().width;
    var ov = document.createElement('div'); ov.className = 'zoom-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    var bar = document.createElement('div'); bar.className = 'zoom-bar';
    var stage = document.createElement('div'); stage.className = 'zoom-stage';
    var clone = svg.cloneNode(true); clone.removeAttribute('style'); clone.style.maxWidth = 'none'; clone.style.height = 'auto';
    var scale = Math.max(1, Math.min(2.2, (window.innerWidth - 48) / natW));
    var pct = document.createElement('span'); pct.className = 'zoom-pct';
    var apply = function(){ clone.style.width = Math.round(natW * scale) + 'px'; pct.textContent = Math.round(scale * 100) + '%'; };
    var mk = function(txt, fn){ var x = document.createElement('button'); x.type = 'button'; x.className = 'btn'; x.textContent = txt; x.onclick = fn; bar.appendChild(x); return x; };
    mk('−', function(){ scale = Math.max(0.4, scale / 1.25); apply(); });
    bar.appendChild(pct);
    mk('+', function(){ scale = Math.min(6, scale * 1.25); apply(); });
    var close = function(){ ov.remove(); document.removeEventListener('keydown', key); document.body.style.overflow = ''; };
    var key = function(e){ if (e.key === 'Escape') close(); };
    mk('✕ ' + D.ui[lang].close, close).classList.add('zoom-close');
    stage.addEventListener('wheel', function(e){ if (!e.ctrlKey) return; e.preventDefault(); scale = Math.min(6, Math.max(0.4, scale * (e.deltaY < 0 ? 1.1 : 0.9))); apply(); }, { passive: false });
    ov.addEventListener('click', function(e){ if (e.target === ov || e.target === stage) close(); });
    stage.appendChild(clone); ov.appendChild(bar); ov.appendChild(stage); document.body.appendChild(ov);
    document.addEventListener('keydown', key); document.body.style.overflow = 'hidden';
    apply(); bar.querySelector('.zoom-close').focus();
  }

  var q = $('q'), res = $('results'), sel = -1;
  function esc(s){ return s.replace(/[&<>]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; }); }
  function norm(s){ return s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,''); }
  function search(){
    var term = norm(q.value.trim()); sel = -1;
    if (term.length < 2) { res.classList.remove('open'); return; }
    var words = term.split(/\\s+/);
    var hits = D.pages[lang].map(function(p){
      var hay = norm(p.title+' '+p.description+' '+p.text), score = 0;
      for (var w=0; w<words.length; w++){ if (hay.indexOf(words[w]) < 0) return null; score += (norm(p.title).indexOf(words[w])>=0 ? 10 : 0) + (norm(p.description).indexOf(words[w])>=0 ? 4 : 0) + 1; }
      var idx = norm(p.text).indexOf(words[0]), snip = idx >= 0 ? p.text.substr(Math.max(0, idx-50), 140) : p.description;
      return { p:p, score:score, snip:snip };
    }).filter(Boolean).sort(function(a,b){ return b.score-a.score; }).slice(0,8);
    res.innerHTML = hits.length ? hits.map(function(h){
      var s = esc(h.snip); words.forEach(function(w){ s = s.replace(new RegExp('('+w.replace(/[.*+?^\${}()|[\\]\\\\]/g,'\\\\$&')+')','ig'), '<mark>$1</mark>'); });
      return '<a href="#'+lang+'-'+h.p.slug+'" role="option"><b>'+h.p.title+'</b><span>…'+s+'…</span></a>'; }).join('')
      : '<a><span>'+D.ui[lang].noResults+'</span></a>';
    res.classList.add('open');
  }
  q.addEventListener('input', search);
  q.addEventListener('keydown', function(e){
    var items = res.querySelectorAll('a[href]');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, Math.min(items.length-1, sel + (e.key==='ArrowDown'?1:-1))); items.forEach(function(a,i){ a.classList.toggle('sel', i===sel); }); }
    if (e.key === 'Enter' && items[Math.max(sel,0)]) { location.hash = items[Math.max(sel,0)].getAttribute('href'); q.value=''; res.classList.remove('open'); }
    if (e.key === 'Escape') { q.value=''; res.classList.remove('open'); }
  });
  res.addEventListener('click', function(){ q.value=''; res.classList.remove('open'); });
  document.addEventListener('keydown', function(e){ if (e.key === '/' && document.activeElement !== q) { e.preventDefault(); q.focus(); } });
  document.addEventListener('click', function(e){ if (!e.target.closest('.search')) res.classList.remove('open'); });

  $('langBtn').onclick = function(){ var i = D.langs.indexOf(lang); go(D.langs[(i + 1) % D.langs.length], slug); };
  $('home').onclick = function(e){ e.preventDefault(); go(lang, 'intro'); };
  $('menuBtn').onclick = function(){ var o = $('side').classList.toggle('open'); this.setAttribute('aria-expanded', o); };

  var spy = null;
  function watch(){
    if (spy) spy.disconnect();
    if (!('IntersectionObserver' in window)) return;
    spy = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting) { document.querySelectorAll('#toc a').forEach(function(a){ a.classList.toggle('on', a.getAttribute('data-scroll') === en.target.id); }); } });
    }, { rootMargin: '-70px 0px -70% 0px' });
    document.querySelectorAll('main h2[id]').forEach(function(h){ spy.observe(h); });
  }
  window.addEventListener('hashchange', function(){ parse(); render(); watch(); window.scrollTo(0,0); $('content').focus({ preventScroll: true }); });
  parse(); render(); watch();
})();
</script>
</body>
</html>`;

mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'index.html'), html);
try { copyFileSync(join(ROOT, 'netlify.toml'), join(ROOT, 'dist', 'netlify.toml')); } catch { /* opcional */ }
console.log(`dist/index.html — ${LANGS.map((l) => `${l}: ${pages[l].length} páginas`).join(', ')} — ${(html.length / 1024).toFixed(0)} KB`);
