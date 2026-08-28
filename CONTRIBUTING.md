# Submitting an extension

Extensions are submitted through the [GitHub Issue Form](https://github.com/DanielLemky/omalaunch-extensions/issues/new?template=submit-extension.yml). Contributors do not need to edit the catalog or open a pull request.

## Requirements

The extension must:

1. Be a public GitHub repository.
2. Be a valid Omarchy plugin with a unique, non-`omarchy.*` plugin ID.
3. Declare at least one extension through `omalaunch.extensions` in `manifest.json`.
4. Include a README with installation, usage, dependencies, and removal instructions.
5. Include a license.
6. Avoid silent package installation or hidden privilege escalation.
7. Shell-quote user-controlled values and use Omalaunch's command argument-array format.
8. Be functional on a current Omarchy installation.

An omarchyplugins.com listing is recommended but not required.

## Submission

Provide the public repository URL, launcher prefixes, and optional omarchyplugins.com listing in the issue form. Confirm each requirement in the submission checklist.

## Review

Maintainers validate the repository's current default-branch commit before adding it to `extensions.json`. Accepted entries must match `schema.json` and remain sorted by plugin ID.

Directory inclusion is a discovery aid, not a security endorsement. Maintainers may reject extensions that are misleading, unsafe, abandoned, duplicative, or unrelated to Omalaunch.
