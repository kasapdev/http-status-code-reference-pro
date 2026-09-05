# HTTP Status Code Reference Pro

[![CI](https://github.com/kasapdev/http-status-code-reference-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/kasapdev/http-status-code-reference-pro/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) ![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-F7DF1E?logo=javascript&logoColor=black)

A searchable, backend-dev-focused reference for every HTTP status code — with a built-in helper that maps common API scenarios to the status code that actually fits.

> Stop guessing between 401 and 403, or 409 and 422. Look up any of the 62 IANA-registered HTTP status codes by number or keyword, or describe the situation your API is in and get the right code with a one-line justification for why it's correct — all offline, in your browser.

## Overview

HTTP Status Code Reference Pro is part of the **Web Utility Suite**. It runs entirely in the browser with no build step, no frameworks, and no network calls — open `index.html` from disk and it works. The tool ships a complete, accurate dataset of every status code registered in the IANA HTTP Status Code Registry (1xx through 5xx, including the WebDAV extension codes), grouped by category and instantly searchable. A dedicated "Which code should I use?" panel covers the everyday API-design decisions backend developers actually face — creation, validation, auth, rate limiting, redirects, and failure modes — each with a short explanation of *why* that code is the right one, not just a lookup table.

## Features

- **Complete, accurate dataset** — all 62 IANA-registered status codes (100–511), each with its correct RFC name and a precise one-to-two-sentence description.
- **Category tabs** — filter to 1xx Informational, 2xx Success, 3xx Redirection, 4xx Client Error, or 5xx Server Error, or view everything at once.
- **Live free-text search** — matches against the code number, its name, or its description simultaneously, with matching text highlighted inline.
- **Which code should I use?** — 12 real-world API scenarios (resource created, validation failed, not authenticated, forbidden, rate limited, not found, no-content deletion, async job accepted, permanent redirect, conflicting state, unhandled crash, upstream outage) each mapped to the correct status code with a justification for *why*.
- **Expandable rows** — click any status code to reveal its full description, spec reference, and category.
- **One-click copy** — copy any code as `"404 Not Found"`-style text, ready to paste into code, docs, or a commit message.
- **Persistent state** — your last search term and category filter are remembered between visits via `localStorage`.
- **Dark & light themes**, fully responsive down to 360px, accessible, and keyboard-driven.

## Installation

No dependencies, no build step.

```bash
git clone https://github.com/kasapdev/http-status-code-reference-pro.git
cd http-status-code-reference-pro
```

Then simply open `index.html` in any modern browser (double-click it, or `file://` it). That's it.

## Usage

1. Browse the **Which code should I use?** panel for common scenarios, or scroll down to the full **Status codes** list.
2. Use the **search box** to find a code by number (`404`) or by keyword (`timeout`, `unauthorized`, `rate limit`).
3. Use the **category tabs** to narrow the list to a single class of status code (1xx–5xx).
4. Click any row to **expand** it and read the full description and spec reference.
5. Click the **copy icon** on a row to copy `"CODE Name"` to your clipboard, or click a scenario's code chip to jump straight to it in the list below.

## Keyboard Shortcuts

| Action                       | Shortcut |
| ----------------------------- | -------- |
| Focus the search box          | <kbd>/</kbd> |
| Show 1xx Informational        | <kbd>1</kbd> |
| Show 2xx Success              | <kbd>2</kbd> |
| Show 3xx Redirection          | <kbd>3</kbd> |
| Show 4xx Client Error         | <kbd>4</kbd> |
| Show 5xx Server Error         | <kbd>5</kbd> |
| Show all categories           | <kbd>0</kbd> |
| Show this help                | <kbd>?</kbd> |
| Clear search / close dialog   | <kbd>Esc</kbd> |

## Screenshots

> _Screenshots coming soon._

![screenshot](docs/screenshot-1.png)
![screenshot](docs/screenshot-2.png)

## Roadmap

- [ ] Copy-as-code snippets (curl, fetch, or framework-specific error responses) per status code
- [ ] A "compare two codes" side-by-side view for easily confused pairs (401 vs 403, 409 vs 422, 301 vs 308)
- [ ] Filterable by common frameworks' default usage (Express, Django REST, Spring)
- [ ] Shareable deep links that pre-select a search term or category
- [ ] Printable / exportable cheat-sheet (PDF or Markdown)

## License

MIT Licensed. Part of the [Web Utility Suite](../index.html).
