# Release Scripts Quick Reference

## 🚀 release.sh - Full Release

Automates the entire release process: version bump, build, commit, publish, tag, and push.

### Usage

```bash
./release.sh [patch|minor|major] [package1 package2 ...]
```

### Examples

```bash
# Release all packages with patch bump (1.0.0 → 1.0.1)
./release.sh patch

# Release all packages with minor bump (1.0.0 → 1.1.0)
./release.sh minor

# Release all packages with major bump (1.0.0 → 2.0.0)
./release.sh major

# Release only types and cli with patch bump
./release.sh patch types cli

# Release only manifest with minor bump
./release.sh minor manifest
```

### What it does

1. ✅ Bumps version in package.json
2. ✅ Builds all specified packages
3. ✅ Commits changes to git
4. ✅ Publishes to npm (in dependency order: types → manifest → cli)
5. ✅ Creates git tags (e.g., `types-v1.0.1`)
6. ✅ Pushes commits and tags to GitHub

---

## 📦 update-versions.sh - Version Update Only

Updates versions and builds packages WITHOUT publishing. Useful for testing.

### Usage

```bash
./update-versions.sh [patch|minor|major] [package1 package2 ...]
```

### Examples

```bash
# Update all packages
./update-versions.sh patch

# Update specific packages
./update-versions.sh minor types cli
```

### What it does

1. ✅ Bumps version in package.json
2. ✅ Builds all specified packages
3. ❌ Does NOT commit
4. ❌ Does NOT publish
5. ❌ Does NOT create tags

After running, you can:
- Review changes with `git diff`
- Manually commit with `git add -A && git commit -m "..."`
- Publish with `./release.sh` or manually

---

## 📋 Version Types

- **patch** - Bug fixes (1.0.0 → 1.0.1)
- **minor** - New features, backward compatible (1.0.0 → 1.1.0)
- **major** - Breaking changes (1.0.0 → 2.0.0)

---

## 🎯 Common Workflows

### First Time Publishing v1.0.0

Since packages are already at v1.0.0, just publish:

```bash
cd types && npm publish && cd ..
cd manifest && npm publish && cd ..
cd cli && npm publish && cd ..
```

### Bug Fix Release

```bash
./release.sh patch
```

### New Feature Release

```bash
./release.sh minor
```

### Breaking Change Release

```bash
./release.sh major
```

### Update Only One Package

```bash
./release.sh patch cli
```

### Test Before Publishing

```bash
# Update versions and build
./update-versions.sh patch

# Review changes
git diff

# If good, commit and publish manually
git add -A && git commit -m "chore: bump versions"
cd types && npm publish && cd ..
cd manifest && npm publish && cd ..
cd cli && npm publish && cd ..
git push
```

---

## ⚠️ Important Notes

1. **Dependency Order**: The scripts automatically publish in the correct order (types → manifest → cli)

2. **Git State**: Make sure your working directory is clean before running release.sh

3. **npm Login**: You must be logged in to npm (`npm login`) before publishing

4. **Permissions**: You need publish access to the @gamecp npm organization

5. **Tags**: Git tags are created in the format `<package>-v<version>` (e.g., `types-v1.0.1`)

---

## 🔍 Troubleshooting

### "npm error 403"
- Make sure you're logged in: `npm login`
- Check you have access to @gamecp organization
- Version might already be published (can't republish same version)

### "Package directory not found"
- Make sure you're in the `/packages` directory
- Check package name spelling (types, manifest, cli)

### "Invalid version type"
- Use only: patch, minor, or major
- Check spelling

---

## 📚 More Info

- See `PUBLISHING.md` for detailed publishing guide
- See `CONTRIBUTING.md` for contribution guidelines
- See `README.md` for general documentation
