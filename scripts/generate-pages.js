#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { marked } = require('marked');
const sanitizeHtml = require('sanitize-html');

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

function repositoryPath(repository) {
  return new URL(repository).pathname.replace(/^\//, '').replace(/\/$/, '');
}

function resolveReadmeUrl(value, repository, type) {
  if (!value || /^(?:[a-z]+:|#)/i.test(value)) return value;
  const base = type === 'image' ? `${repository}/raw/HEAD/` : `${repository}/blob/HEAD/`;
  return new URL(value, base).href;
}

async function renderReadme(extension) {
  const rawUrl = `https://raw.githubusercontent.com/${repositoryPath(extension.repository)}/HEAD/README.md`;
  const response = await fetch(rawUrl);
  if (!response.ok) throw new Error(`README request failed (${response.status}) for ${extension.id}`);

  const markdown = await response.text();
  const renderer = new marked.Renderer();
  renderer.link = ({ href, title, tokens }) => {
    const resolved = resolveReadmeUrl(href, extension.repository, 'link');
    const titleAttribute = title ? ` title="${escapeHtml(title)}"` : '';
    return `<a href="${escapeHtml(resolved)}"${titleAttribute}>${renderer.parser.parseInline(tokens)}</a>`;
  };
  renderer.image = ({ href, title, text }) => {
    const resolved = resolveReadmeUrl(href, extension.repository, 'image');
    const titleAttribute = title ? ` title="${escapeHtml(title)}"` : '';
    return `<img src="${escapeHtml(resolved)}" alt="${escapeHtml(text)}"${titleAttribute}>`;
  };

  const rendered = marked.parse(markdown, { renderer });
  return sanitizeHtml(rendered, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'name', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      code: ['class']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'nofollow noopener' }, true)
    }
  });
}

async function main() {
  fs.rmSync(outputRoot, { recursive: true, force: true });

  for (const extension of catalog.extensions) {
    const directory = path.join(outputRoot, extension.id);
    const name = escapeHtml(extension.name);
    const description = escapeHtml(extension.description);
    const author = escapeHtml(extension.author);
    const repository = escapeHtml(extension.repository);
    const marketplaceLink = extension.omarchyPluginsUrl
      ? `<a class="detail-link" href="${escapeHtml(extension.omarchyPluginsUrl)}">View on Omarchy Plugins <span aria-hidden="true">↗</span></a>`
      : '';
    const prefixes = (extension.prefixes || [])
      .map((prefix) => `<code class="prefix">${escapeHtml(prefix)}</code>`)
      .join('');
    const modes = extension.modes
      .map((mode) => `<code class="prefix">${escapeHtml(mode)}</code>`)
      .join('');
    const readme = await renderReadme(extension);

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
        <div><dt>Mode${extension.modes.length === 1 ? '' : 's'}</dt><dd class="prefixes">${modes}</dd></div>
        ${prefixes ? `<div><dt>Prefix${extension.prefixes.length === 1 ? '' : 'es'}</dt><dd class="prefixes">${prefixes}</dd></div>` : ''}
      </dl>

      <div class="detail-actions">
        <a class="button" href="${repository}">View source <span aria-hidden="true">↗</span></a>
        ${marketplaceLink}
      </div>

      <section class="readme" aria-labelledby="documentation-title">
        <p class="detail-kicker">From the repository</p>
        <h2 id="documentation-title">Documentation</h2>
        <div class="readme-content">${readme}</div>
      </section>
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

  console.log(`Generated ${catalog.extensions.length} extension page(s) with repository documentation.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
