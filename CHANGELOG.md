# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.1] - 2026-09-06

### Fixed

- Corrected the hardcoded status count in `index.html` (`statusText` badge and
  `resultCount` label), which was stuck at "70 codes" / "70 of 70" from an
  earlier iteration of the dataset. The actual dataset has always been the 62
  IANA-registered status codes described in the README, and `app.js` already
  computed the correct number at runtime — but the static markup shown before
  JavaScript finishes running (or if it fails to load) displayed the wrong,
  inflated count. Both strings now read "62 codes" / "62 of 62" to match the
  real data.
