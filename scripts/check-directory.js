const fs = require('fs')

const { extensions } = JSON.parse(fs.readFileSync('extensions.json', 'utf8'))
const ids = extensions.map(extension => extension.id)
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)

if (duplicates.length) {
  throw new Error(`Duplicate extension IDs: ${[...new Set(duplicates)].join(', ')}`)
}

const sorted = [...ids].sort((a, b) => a.localeCompare(b))
if (ids.some((id, index) => id !== sorted[index])) {
  throw new Error('Extensions must be sorted by id')
}

console.log(`ok - ${extensions.length} extension(s), unique and sorted`)
