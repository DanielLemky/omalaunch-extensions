# Contributing an extension

Extensions are submitted by pull request to `extensions.json`.

## Requirements

The extension must:

1. Be a public GitHub repository.
2. Be a valid Omarchy plugin with a unique, non-`omarchy.*` plugin ID.
3. Declare at least one provider through `omalaunch.queryProviders` in `manifest.json`.
4. Include a README with installation, usage, dependencies, and removal instructions.
5. Include a license.
6. Avoid silent package installation or hidden privilege escalation.
7. Shell-quote user-controlled values and use Omalaunch's command argument-array format.
8. Be functional on a current Omarchy installation.

An omarchyplugins.com listing is recommended but not required.

## Directory entry

Add one entry matching `schema.json`. Keep entries sorted lexicographically by `id`. The `omarchyPluginsUrl` field is optional and must point to the extension's page on omarchyplugins.com when present.

Run validation locally:

```bash
npx --yes ajv-cli@5 validate --spec=draft2020 -s schema.json -d extensions.json
node scripts/check-directory.js
```

## Review

Directory inclusion is a discovery aid, not a security endorsement. Maintainers may reject extensions that are misleading, unsafe, abandoned, duplicative, or unrelated to Omalaunch.
