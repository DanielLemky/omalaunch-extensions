const grid = document.querySelector('#extension-grid');
const count = document.querySelector('#extension-count');

function createCard(extension, index) {
  const card = document.createElement('article');
  card.className = 'extension-card';

  const number = document.createElement('span');
  number.className = 'card-index';
  number.textContent = String(index + 1).padStart(2, '0');

  const heading = document.createElement('div');
  heading.className = 'card-heading';

  const title = document.createElement('h3');
  title.textContent = extension.name;
  heading.append(title);

  if (extension.verified === true) {
    const verified = document.createElement('span');
    verified.className = 'verified-badge';
    verified.title = 'Locally tried and verified by a directory maintainer';
    verified.setAttribute('aria-label', verified.title);
    verified.textContent = '✓ Verified';
    heading.append(verified);
  }

  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = extension.description;

  const meta = document.createElement('div');
  meta.className = 'card-meta';

  const prefixes = document.createElement('div');
  prefixes.className = 'prefixes';
  prefixes.setAttribute('aria-label', 'Extension modes and launcher prefixes');
  [...extension.modes, ...(extension.prefixes || [])].forEach((value) => {
    const prefix = document.createElement('code');
    prefix.className = 'prefix';
    prefix.textContent = value;
    prefixes.append(prefix);
  });

  const link = document.createElement('a');
  link.className = 'card-link';
  link.href = `extensions/${encodeURIComponent(extension.id)}/`;
  link.textContent = 'View extension';
  link.append(Object.assign(document.createElement('span'), {
    textContent: '↗',
    ariaHidden: 'true'
  }));

  meta.append(prefixes, link);
  card.append(number, heading, description, meta);
  return card;
}

fetch('./extensions.json')
  .then((response) => {
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.json();
  })
  .then(({ extensions }) => {
    const newestFirst = [...extensions].sort((left, right) =>
      right.addedAt.localeCompare(left.addedAt) || left.id.localeCompare(right.id)
    );
    count.textContent = `${extensions.length} ${extensions.length === 1 ? 'extension' : 'extensions'}`;
    grid.replaceChildren(...newestFirst.map(createCard));
  })
  .catch(() => {
    grid.innerHTML = '<p class="notice">The directory could not be loaded. <a href="extensions.json">View the catalog data</a>.</p>';
  });
