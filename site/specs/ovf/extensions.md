# Extensions

OVF uses the same `x_` namespace mechanism as every other OES spec.

## The rule

Any field whose name starts with `x_` is reserved for extensions and is
never defined by the core OVF spec. This applies at any level of
`video.json`.

**Naming format:** `x_{namespace}_{field}`, both `snake_case`.

```json
{
  "ovf_version": "0.1.0",
  "id": "install-python",
  "title": "Installing Python",
  "video_url": "https://example.com/videos/python-setup",
  "x_acmeplatform_captions_url": "https://example.com/captions/python-setup.vtt"
}
```

## Compliance rules

- Parsers must ignore unknown `x_` fields without error.
- Core fields are never retroactively repurposed from an `x_` name.
- Extensions must never be required to play or understand the video.
- Namespace collisions are the author's responsibility.

## Registering an extension

Namespaces intended for reuse are listed in the shared
<a href="/extensions/registry.md">extension registry</a> — one registry
shared across OPF, OQF, OCF, OAF, and OVF. Open a pull request against
`extensions/registry.md` to register one.
