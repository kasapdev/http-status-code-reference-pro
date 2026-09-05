# HTTP Status Code Reference Pro

A searchable, filterable reference of every HTTP status code, plus a "which code should I use?" helper for real API-design decisions.

> Stop guessing between 401 and 403, or 200 and 204. Search by code or keyword, filter by category, and expand any entry for the full picture — all instant, all offline, nothing sent anywhere.

## Overview

HTTP Status Code Reference Pro is part of the **Web Utility Suite**. It runs entirely in the browser with no build step, no frameworks, and no network calls — open `index.html` from disk and it works. Every standard status code from 100 to 511 is included with an accurate description sourced from the HTTP specification and the IANA status code registry, grouped into Informational (1xx), Success (2xx), Redirection (3xx), Client Error (4xx), and Server Error (5xx). A dedicated scenario panel maps common backend/API situations — "not authenticated", "rate limited", "validation failed" — to the correct code with a one-line justification, so you can settle the argument in your next PR review.

## Features

- **Full status code catalog** — every code from 100–511 that's part of the HTTP spec or common WebDAV/extension set, with accurate descriptions (no fabricated codes).
- **Live search** — matches against the code number, name, or description text as you type, with matches highlighted inline.
- **Category filter** — segmented tabs for All / 1xx / 2xx / 3xx / 4xx / 5xx.
- **Expandable rows** — click any code to reveal its full description and category metadata.
- **"Which code should I use?"** — 10 curated real-world scenarios (resource created, validation failed, not authenticated, forbidden, rate limited, and more) each mapped to the correct status code with a short justification. Click a scenario's code to jump straight to its full entry.
- **Copy** — copy any code + name (e.g. `404 Not Found`) to the clipboard with one click.
- **Auto-persist** — your last search, category filter, and expanded rows are saved to `localStorage` and restored on return.
- **Dark & light themes**, fully responsive down to 360px, accessible, and keyboard-driven.

## Installation

No dependencies, no build step.

```bash
git clone https://github.com/kasapdev/http-status-code-reference-pro.git
cd http-status-code-reference-pro
```

Then simply open `index.html` in any modern browser (double-click it, or `file://` it). That's it.

## Usage

1. Type in the search box to filter by **code number or keyword** — e.g. `404`, `unauthorized`, `timeout`.
2. Use the **category tabs** to narrow the list to a status-code class.
3. Click a **row** to expand its full description and metadata.
4. Check the **"Which code should I use?"** panel for common scenario → status-code mappings, and click a code chip to jump to it.
5. Click the **copy icon** on any row to copy `<code> <name>` to your clipboard.

## Keyboard Shortcuts

| Action               | Shortcut |
| -------------------- | -------- |
| Focus search          | <kbd>/</kbd>   |
| Clear search / close dialog | <kbd>Esc</kbd> |
| Show shortcuts help  | <kbd>?</kbd>   |

## Screenshots

> _Screenshots coming soon._

![screenshot](docs/screenshot-1.png)

## Roadmap

- [ ] Copy the full JSON catalog of codes for use in tests/fixtures
- [ ] Per-code "common causes" and "how to fix" checklist for 4xx/5xx
- [ ] Deep-linkable URLs per status code (`#404`)
- [ ] REST framework cheat-sheet cross-reference (Express, Django, Rails)

## License

MIT Licensed. Part of the [Web Utility Suite](../index.html).
