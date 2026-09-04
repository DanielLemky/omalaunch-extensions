const fs = require('node:fs')

const catalog = JSON.parse(fs.readFileSync('extensions.json', 'utf8'))
if (catalog.schemaVersion !== 1) throw new Error('Catalog schemaVersion must be 1')
if (!Array.isArray(catalog.extensions)) throw new Error('Catalog extensions must be an array')

const ids = catalog.extensions.map(extension => extension.id)
const repositories = catalog.extensions.map(extension => extension.repository.replace(/\/$/, '').toLowerCase())

function duplicates(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))]
}

const duplicateIds = duplicates(ids)
if (duplicateIds.length) throw new Error(`Duplicate extension IDs: ${duplicateIds.join(', ')}`)
const duplicateRepositories = duplicates(repositories)
if (duplicateRepositories.length) throw new Error(`Duplicate extension repositories: ${duplicateRepositories.join(', ')}`)

const sorted = [...ids].sort((left, right) => left < right ? -1 : left > right ? 1 : 0)
if (ids.some((id, index) => id !== sorted[index])) throw new Error('Extensions must be sorted by id')

for (const extension of catalog.extensions) {
  for (const field of ['capabilities', 'modes', 'prefixes']) {
    const values = extension[field] || []
    if (duplicates(values).length) throw new Error(`${extension.id} has duplicate ${field}`)
  }
}

console.log(`ok - ${catalog.extensions.length} extension(s), unique and sorted`)
