#!/usr/bin/env node

const fs = require('node:fs');

const catalog = JSON.parse(fs.readFileSync('extensions.json', 'utf8'));
const TIMEOUT_MS = 15000;

function repositoryPath(repository) {
  const url = new URL(repository);
  if (url.protocol !== 'https:' || url.hostname !== 'github.com') throw new Error(`unsupported repository: ${repository}`);
  const parts = url.pathname.replace(/^\/+|\/+$/g, '').split('/');
  if (parts.length !== 2 || !parts.every(Boolean)) throw new Error(`invalid GitHub repository: ${repository}`);
  return parts.join('/');
}

async function fetchText(url, required = true) {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) {
    if (!required && response.status === 404) return null;
    throw new Error(`${url} returned ${response.status}`);
  }
  const text = await response.text();
  if (text.length > 1024 * 1024) throw new Error(`${url} exceeds 1 MiB`);
  return text;
}

function safeRelativePath(value) {
  return typeof value === 'string' && value && !value.startsWith('/')
    && value.split('/').every(part => part && part !== '.' && part !== '..');
}

function sortedUnique(values) {
  return [...new Set(values)].sort((left, right) => left < right ? -1 : left > right ? 1 : 0);
}

function equalValues(left, right) {
  return JSON.stringify(sortedUnique(left)) === JSON.stringify(sortedUnique(right));
}

async function checkExtension(entry) {
  const repository = repositoryPath(entry.repository);
  const rawRoot = `https://raw.githubusercontent.com/${repository}/HEAD`;
  const manifest = JSON.parse(await fetchText(`${rawRoot}/manifest.json`));
  if (manifest.id !== entry.id) throw new Error(`catalog id ${entry.id} does not match manifest id ${manifest.id}`);
  if (!Array.isArray(manifest.kinds) || !manifest.kinds.includes('extension')) {
    throw new Error(`${entry.id}: manifest kinds must include extension`);
  }
  const contribution = manifest.omalaunch;
  const files = contribution && Array.isArray(contribution.extensions) ? contribution.extensions : [];
  const providers = contribution && Array.isArray(contribution.extensionProviders) ? contribution.extensionProviders : [];
  if (files.length === 0 && providers.length === 0) {
    throw new Error(`${entry.id}: manifest must declare extensions or extensionProviders`);
  }
  if (!files.every(safeRelativePath)) throw new Error(`${entry.id}: manifest has an unsafe extension path`);

  const definitions = [];
  for (const file of files) {
    const value = JSON.parse(await fetchText(`${rawRoot}/${file}`));
    const values = Array.isArray(value) ? value : [value];
    for (const definition of values) {
      if (!definition || definition.schemaVersion !== 1 || typeof definition.id !== 'string') {
        throw new Error(`${entry.id}: ${file} contains an invalid extension definition`);
      }
      definitions.push(definition);
    }
  }
  if (definitions.length) {
    const capabilities = definitions.map(value => value.capability || value.id);
    const modes = definitions.map(value => value.mode || 'prefix');
    const prefixes = definitions.flatMap(value => Array.isArray(value.prefixes)
      ? value.prefixes : (typeof value.prefix === 'string' ? [value.prefix] : []));
    if (!equalValues(entry.capabilities, capabilities)) throw new Error(`${entry.id}: catalog capabilities do not match extension definitions`);
    if (!equalValues(entry.modes, modes)) throw new Error(`${entry.id}: catalog modes do not match extension definitions`);
    if (!equalValues(entry.prefixes || [], prefixes)) throw new Error(`${entry.id}: catalog prefixes do not match extension definitions`);
  }

  const readme = await fetchText(`${rawRoot}/README.md`);
  if (!/omarchy plugin add\b/.test(readme) || !/omarchy plugin remove\b/.test(readme)) {
    throw new Error(`${entry.id}: README must document Omarchy installation and removal`);
  }
  const licenseNames = ['LICENSE', 'LICENSE.md', 'COPYING'];
  let hasLicense = false;
  for (const name of licenseNames) {
    if (await fetchText(`${rawRoot}/${name}`, false) !== null) { hasLicense = true; break; }
  }
  if (!hasLicense) throw new Error(`${entry.id}: repository has no recognized license file`);
  console.log(`ok - ${entry.id} repository metadata matches the catalog`);
}

async function main() {
  for (const extension of catalog.extensions) await checkExtension(extension);
}

main().catch(error => {
  console.error(`Repository validation failed: ${error.message}`);
  process.exitCode = 1;
});
