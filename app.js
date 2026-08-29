const grid = document.querySelector('#extension-grid');
const count = document.querySelector('#extension-count');

function createCard(extension, index) {
  const card = document.createElement('article');
  card.className = 'extension-card';

  const number = document.createElement('span');
  number.className = 'card-index';
  number.textContent = String(index + 1).padStart(2, '0');

  const title = document.createElement('h3');
  title.textContent = extension.name;

  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = extension.description;

  const meta = document.createElement('div');
  meta.className = 'card-meta';

  const prefixes = document.createElement('div');
  prefixes.className = 'prefixes';
  prefixes.setAttribute('aria-label', 'Launcher prefixes');
  extension.prefixes.forEach((value) => {
    const prefix = document.createElement('code');
    prefix.className = 'prefix';
    prefix.textContent = value;
    prefixes.append(prefix);
  });

  const link = document.createElement('a');
  link.className = 'card-link';
  link.href = extension.marketplace || extension.repository;
  link.textContent = extension.marketplace ? 'View extension' : 'View on GitHub';
  link.append(Object.assign(document.createElement('span'), {
    textContent: '↗',
    ariaHidden: 'true'
  }));

  meta.append(prefixes, link);
  card.append(number, title, description, meta);
  return card;
}

fetch('./extensions.json')
  .then((response) => {
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.json();
  })
  .then(({ extensions }) => {
    count.textContent = `${extensions.length} ${extensions.length === 1 ? 'extension' : 'extensions'}`;
    grid.replaceChildren(...extensions.map(createCard));
  })
  .catch(() => {
    grid.innerHTML = '<p class="notice">The directory could not be loaded. <a href="extensions.json">View the catalog on GitHub</a>.</p>';
  });
