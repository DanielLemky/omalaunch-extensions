# Submitting an extension

Extensions are submitted through the [GitHub Issue Form](https://github.com/DanielLemky/omalaunch-extensions/issues/new?template=submit-extension.yml). Contributors do not need to edit the catalog or open a pull request.

Submission is optional. Authors retain ownership and choose their license. Directory inclusion is not required to use or distribute an extension.

## Requirements

The extension must:

1. Be a public GitHub repository.
2. Be a valid Omarchy plugin with a unique, non-`omarchy.*` plugin ID.
3. Declare at least one extension through `omalaunch.extensions` or `omalaunch.extensionProviders` in `manifest.json`.
4. Include a README with installation, usage, dependencies, privilege boundaries, and removal instructions.
5. Include a license.
6. Avoid silent package installation or hidden privilege escalation.
7. Represent commands as argument arrays, pass user-controlled values as complete arguments, and not construct shell command strings.
8. Be functional on a current Omarchy installation.

An omarchyplugins.com listing is recommended but not required.

## Submission

Provide the exact plugin ID, public repository URL, description, capabilities, modes, optional launcher prefixes, and optional omarchyplugins.com listing in the issue form. Confirm each requirement in the submission checklist.

## Review

Maintainers validate the repository's current default-branch commit before adding it to `extensions.json`. Accepted entries must match `schema.json` and remain sorted by plugin ID. Automated checks compare catalog metadata with static extension definitions. Dynamic extension providers require manual review because directory automation does not execute plugin code.

Directory inclusion is a discovery aid, not a security endorsement. Maintainers may reject extensions that are misleading, unsafe, abandoned, duplicative, or unrelated to Omalaunch.

## Listing maintenance

Maintainers can update, suspend, or remove a listing when:

- The repository becomes unavailable, archived, or invalid.
- The extension no longer works on a current Omarchy installation.
- Ownership or the canonical repository changes without verification.
- The extension becomes misleading or unsafe.
- The author requests removal.

A new owner must provide evidence of the transfer from the existing repository or author. Removal from this directory does not remove installed copies or revoke the author's license.
