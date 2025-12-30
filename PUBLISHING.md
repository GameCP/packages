# Publishing Guide

## ✅ Pre-Publishing Checklist

All packages are now at **v1.0.0** and ready to publish!

- ✅ Version bumped to 1.0.0
- ✅ Dependencies updated to use npm versions (^1.0.0)
- ✅ All packages built successfully
- ✅ Git tags created (types-v1.0.0, manifest-v1.0.0, cli-v1.0.0)
- ✅ Repository pushed to GitHub

## 📦 Publishing to npm

### Step 1: Login to npm

```bash
npm login
```

Enter your npm credentials for the @gamecp organization.

### Step 2: Publish in Order

**Important:** Publish in dependency order (types → manifest → cli)

#### Publish @gamecp/types

```bash
cd types
npm publish
```

#### Publish @gamecp/manifest

```bash
cd ../manifest
npm publish
```

#### Publish @gamecp/cli

```bash
cd ../cli
npm publish
```

### Step 3: Verify Publication

Check that packages are live:
- https://www.npmjs.com/package/@gamecp/types
- https://www.npmjs.com/package/@gamecp/manifest
- https://www.npmjs.com/package/@gamecp/cli

### Step 4: Test Installation

```bash
# Test installing globally
npm install -g @gamecp/cli

# Verify it works
gamecp --help

# Test creating an extension
gamecp init test-extension
```

## 🔄 Future Updates

### Patch Release (1.0.1)

```bash
cd <package>
npm version patch
npm run build
npm publish
git push && git push --tags
```

### Minor Release (1.1.0)

```bash
cd <package>
npm version minor
npm run build
npm publish
git push && git push --tags
```

### Major Release (2.0.0)

```bash
cd <package>
npm version major
npm run build
npm publish
git push && git push --tags
```

## 📝 Post-Publishing

After publishing, update:
1. Main GameCP documentation
2. Extension examples
3. Announcement on Discord/social media

## 🎉 Ready to Publish!

All packages are versioned at **1.0.0** and ready for their first npm release.

Run the commands above to publish to npm! 🚀
