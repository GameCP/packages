# Quick Commands Cheat Sheet

## 🚀 Release Commands (Most Common)

```bash
# Patch release (bug fixes) - 1.0.0 → 1.0.1
npm run release:patch

# Minor release (new features) - 1.0.0 → 1.1.0
npm run release:minor

# Major release (breaking changes) - 1.0.0 → 2.0.0
npm run release:major
```

## 📦 Individual Package Releases

```bash
npm run release:types      # Release only @gamecp/types
npm run release:manifest   # Release only @gamecp/manifest
npm run release:cli        # Release only @gamecp/cli
```

## 🔧 Version Updates (No Publishing)

```bash
npm run update:patch       # Bump patch version
npm run update:minor       # Bump minor version
npm run update:major       # Bump major version
```

## 🔨 Build Commands

```bash
npm run build:all          # Build all packages
npm run build:types        # Build types only
npm run build:manifest     # Build manifest only
npm run build:cli          # Build CLI only
```

## 📤 Manual Publishing

```bash
npm run publish:all        # Publish all (in correct order)
npm run publish:types      # Publish types only
npm run publish:manifest   # Publish manifest only
npm run publish:cli        # Publish CLI only
```

## 📋 First Time Setup

```bash
# 1. Make sure you're logged in to npm
npm login

# 2. Publish v1.0.0 (current version)
npm run publish:all
```

## 🔄 Typical Workflow

```bash
# 1. Make your changes to packages
# 2. Test locally
npm run build:all

# 3. Release (this does everything)
npm run release:patch

# Done! ✨
```

## 💡 Tips

- **Always use `release:*`** for production releases (handles everything)
- **Use `update:*`** for testing version bumps before publishing
- **Use `publish:*`** only for manual publishing (like first time)
- **Packages publish in order**: types → manifest → cli (dependencies)

## 🆘 Troubleshooting

**"npm error 403"**
- Run `npm login` first
- Make sure you have access to @gamecp org

**"Version already published"**
- Can't republish same version
- Use `npm run release:patch` to bump version

**"Command not found"**
- Make sure you're in `/packages` directory
- Run `npm install` if needed
