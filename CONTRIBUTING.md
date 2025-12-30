# Contributing to GameCP Packages

Thank you for your interest in contributing to the GameCP developer kit! 🎉

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/GameCP/packages.git
   cd packages
   ```

2. **Install dependencies for each package**
   ```bash
   cd types && npm install && cd ..
   cd manifest && npm install && cd ..
   cd cli && npm install && cd ..
   ```

3. **Build all packages**
   ```bash
   cd types && npm run build && cd ..
   cd manifest && npm run build && cd ..
   cd cli && npm run build && cd ..
   ```

## Package Structure

- **`types/`** - TypeScript type definitions
- **`manifest/`** - Manifest validation utilities
- **`cli/`** - Command-line interface tool

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Update code in the relevant package's `src/` directory
- Add tests if applicable
- Update documentation in README files

### 3. Build and Test

```bash
# In the package you modified
npm run build

# Test the CLI locally
cd cli
npm link
gamecp --help
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: your descriptive commit message"
```

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Publishing (Maintainers Only)

### Before Publishing

1. Update version in `package.json`
2. Update dependencies to use published versions (not `file:../`)
3. Build the package
4. Test thoroughly

### Publishing to npm

```bash
# Login to npm (first time only)
npm login

# From each package directory
npm version patch  # or minor, major
npm publish
```

### After Publishing

Update dependent packages to use the new version.

## Code Style

- Use TypeScript strict mode
- Follow existing code formatting
- Add JSDoc comments for public APIs
- Keep functions focused and small

## Questions?

- Open an issue on GitHub
- Join our Discord community
- Check existing issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
