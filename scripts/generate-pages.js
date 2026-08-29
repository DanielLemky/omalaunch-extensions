#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'extensions.json'), 'utf8'));
const outputRoot = path.join(root, 'extensions');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

fs.rmSync(outputRoot, { recursive: true, force: true });

for (const extension of catalog.extensions) {
  const directory = path.join(outputRoot, extension.id);
  const name = escapeHtml(extension.name);
  const description = escapeHtml(extension.description);
  const author = escapeHtml(extension.author);
  const repository = escapeHtml(extension.repository);
  const installCommand = `omarchy plugin add ${extension.repository} --enable`;
  const marketplaceLink = extension.omarchyPluginsUrl
    ? `<a class="detail-link" href="${escapeHtml(extension.omarchyPluginsUrl)}">View on Omarchy Plugins <span aria-hidden="true">↗</span></a>`
    : '';
  const prefixes = extension.prefixes
    .map((prefix) => `<code class="prefix">${escapeHtml(prefix)}</code>`)
    .join('');

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#080624">
  <title>${name} — Omalaunch Extensions</title>
  <link rel="stylesheet" href="../../styles.css">
</head>
<body class="detail-page">
  <main>
    <nav class="detail-nav" aria-label="Breadcrumb">
      <a href="../../">← All extensions</a>
    </nav>

    <article class="extension-detail">
      <img class="detail-icon" src="../../assets/omalaunch-icon.png" alt="" width="72" height="72">
      <p class="detail-kicker">Omalaunch extension</p>
      <h1>${name}</h1>
      <p class="detail-description">${description}</p>

      <dl class="detail-meta">
        <div><dt>Author</dt><dd>${author}</dd></div>
        <div><dt>Prefix${extension.prefixes.length === 1 ? '' : 'es'}</dt><dd class="prefixes">${prefixes}</dd></div>
      </dl>

      <section class="install" aria-labelledby="install-title">
        <p class="detail-kicker">Installation</p>
        <h2 id="install-title">Install from GitHub</h2>
        <pre><code>${escapeHtml(installCommand)}</code></pre>
      </section>

      <div class="detail-actions">
        <a class="button" href="${repository}">View source <span aria-hidden="true">↗</span></a>
        ${marketplaceLink}
      </div>
    </article>
  </main>

  <footer>
    <nav aria-label="Project links">
      <a href="https://github.com/DanielLemky/omalaunch">Omalaunch</a>
      <a href="https://github.com/DanielLemky/omalaunch-extensions">Directory on GitHub</a>
      <a href="https://omarchy.org">Omarchy</a>
    </nav>
    <p>Review extension source before installing.</p>
  </footer>
</body>
</html>
`;

  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), html);
}

console.log(`Generated ${catalog.extensions.length} extension page(s).`);
