# Hosting

OPF places no requirements on where a set lives. Any location that can serve
static files over HTTP(S) works. An LMS or consumer only ever needs one
thing: a stable URL to the set's `set.json`. Below are the common options.

## 1. Public GitHub repo via `raw.githubusercontent.com`

The simplest option. Push your set to a public GitHub repo, then use the
raw content URL:

```
https://raw.githubusercontent.com/{owner}/{repo}/{branch}/set.json
```

Every co-located `path` inside `set.json` resolves relative to this URL;
externally-referenced questions (`question_url`) resolve independently of
where the set itself is hosted. Pros: free, versioned, no setup. Cons: no
CDN caching guarantees, rate limits apply to unauthenticated requests, and
GitHub may serve stale content briefly after a push.

## 2. Public GitHub repo via jsDelivr CDN

Use [jsDelivr's GitHub CDN](https://www.jsdelivr.com/) to front the same
repo with proper CDN caching and no GitHub rate limits:

```
https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/set.json
```

Pin to a tag or commit SHA instead of a branch for immutable, cacheable
URLs:

```
https://cdn.jsdelivr.net/gh/{owner}/{repo}@v0.1.0/set.json
```

Pros: fast, globally cached, free, immutable pinning available. This is the
recommended option for production LMS integrations pointing at public sets.

## 3. Private GitHub repo via token-based access

For sets that shouldn't be public, use the GitHub Contents API with a
token that has `repo` read access:

```
GET https://api.github.com/repos/{owner}/{repo}/contents/set.json?ref={branch}
Authorization: Bearer {token}
Accept: application/vnd.github.raw+json
```

The consuming application is responsible for storing and scoping the token
— OPF does not define an auth model. A common pattern is a server-side
proxy that holds the token and re-serves the raw JSON to trusted clients,
so the token never reaches a browser.

## 4. S3-compatible object storage

Works with AWS S3, Cloudflare R2, MinIO, Backblaze B2, or any S3-compatible
store. Upload the set's folder structure as-is (object keys mirroring the
file paths), then either:

- Serve the bucket directly over HTTPS with public-read objects, or
- Front it with a CDN (CloudFront, Cloudflare) for caching and a custom
  domain, or
- Generate signed/presigned URLs per request for private sets.

```
https://{bucket}.s3.{region}.amazonaws.com/{prefix}/set.json
https://{bucket}.r2.dev/{prefix}/set.json
```

This is the recommended option when a set needs private, per-user access
control that a static CDN can't provide — issue short-lived signed URLs
from your own backend after checking the requester's entitlement.

## 5. Self-hosted static file server

Any static file server — nginx, Caddy, a Node.js `express.static()` app —
can serve a set. Point it at the set's root directory and ensure:

- CORS headers allow the origins that need to fetch it (`Access-Control-Allow-Origin`), since consumers are typically browser-based.
- Correct `Content-Type` headers: `application/json` for `.json` files, `text/markdown` or `text/plain` for `.md` files.
- Directory listing is disabled if the set shouldn't be publicly browsable.

## Choosing between options

| Scenario | Recommended |
|---|---|
| Open-source, public practice set | jsDelivr CDN |
| Quick prototype / internal tool | Raw GitHub URL |
| Paid or gated content | S3-compatible storage with signed URLs |
| Enterprise, air-gapped, or on-prem LMS | Self-hosted static server |
| Private team content, GitHub-native workflow | Private repo + token proxy |

## A note on caching

Because OPF sets are static files, aggressive HTTP caching is safe and
encouraged — content only changes when someone pushes a new commit. Prefer
pinning to a tag/commit/version over a mutable branch reference whenever the
hosting option supports it, so cached responses never go stale unexpectedly.
