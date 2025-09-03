# Release Flow

This document describes the steps for publishing a new release of the `@eloritzkovitz/server-essentials` package.

---

## 1. Update Version

- Edit `package.json` and increment the `"version"` field.

## 2. Generate Documentation

- Run:
  ```bash
  npm run docs
  ```
- Preview the documentation in the `docs/` folder (`docs/index.html`).

## 3. Build the Package

- Run:
  ```bash
  npm run build
  ```

## 4. Commit Changes

- Stage and commit all changes:
  ```bash
  git add .
  git commit -m "Release vX.Y.Z: update docs and build"
  git push
  ```

## 5. Publish to npm

- Run:
  ```bash
  npm publish --access public
  ```

## 6. (Optional) Tag the Release

- Tag the release in git:
  ```bash
  git tag vX.Y.Z
  git push --tags
  ```
