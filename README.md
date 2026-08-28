# Omalaunch Extension Directory

A community directory of extensions for [Omalaunch](https://github.com/DanielLemky/omalaunch), the extensible command launcher for Omarchy.

This repository is a catalog. Every extension remains an independent, standard Omarchy plugin hosted in its own repository.

## Browse extensions

See [`extensions.json`](extensions.json) for the machine-readable directory.

When an extension is listed on [omarchyplugins.com](https://omarchyplugins.com), its directory entry links to the marketplace page. The extension's GitHub repository remains the canonical source.

## Installation

Prefer the linked omarchyplugins.com page when available. Otherwise install directly from the extension repository:

```bash
omarchy plugin add https://github.com/example/omalaunch-example --enable
```

Omalaunch discovers the extension automatically when the enabled plugin declares extension files in its manifest:

```json
"omalaunch": {
  "extensions": ["omalaunch.json"]
}
```

No separate registration inside Omalaunch is required.

## Add an extension

Submit a pull request that adds one entry to `extensions.json`, sorted by `id`:

```json
{
  "id": "example.omalaunch-agent",
  "name": "Example Agent",
  "description": "Launch Example Agent prompts from Omalaunch",
  "author": "Example Author",
  "repository": "https://github.com/example/omalaunch-agent",
  "omarchyPluginsUrl": "https://omarchyplugins.com/plugins/example-agent",
  "prefixes": ["example"]
}
```

`omarchyPluginsUrl` is optional. It can be added later after the extension appears on omarchyplugins.com.

See [CONTRIBUTING.md](CONTRIBUTING.md) for acceptance requirements.

## Related projects

- [Omalaunch](https://github.com/DanielLemky/omalaunch)
- [Omarchy Plugins](https://omarchyplugins.com)

## License

The directory metadata and supporting files are available under the [MIT License](LICENSE).
