/**
 * @gamecp/build - Build tools for GameCP extensions
 * 
 * Provides a standardized build process for all extensions:
 * - Separate UI bundle (for browser, React external)
 * - Separate handlers bundle (for isolated-vm backend)
 * - Automatic integrity hash generation
 * - Version bumping
 * - Release packaging
 */

import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import archiver from 'archiver';

export interface BuildConfig {
    /** Entry point for UI components (default: src/index.tsx) */
    uiEntry?: string;
    /** Entry point for handlers (default: src/handlers.ts) */
    handlersEntry?: string;
    /** Output directory (default: dist) */
    outDir?: string;
    /** Additional external dependencies for UI */
    uiExternal?: string[];
    /** Additional external dependencies for handlers */
    handlersExternal?: string[];
    /** Minify output (default: false) */
    minify?: boolean;
}

export interface BuildResult {
    uiBundlePath: string;
    handlersBundlePath: string;
    uiBundleSize: number;
    handlersBundleSize: number;
    integrityHash: string;
}

/**
 * Build a GameCP extension
 * 
 * @param extensionDir - Root directory of the extension
 * @param config - Optional build configuration
 * @returns Build result with paths and integrity hash
 */
export async function buildExtension(
    extensionDir: string,
    config: BuildConfig = {}
): Promise<BuildResult> {
    const {
        uiEntry = 'src/index.tsx',
        handlersEntry = 'src/handlers.ts',
        outDir = 'dist',
        uiExternal = [],
        handlersExternal = [],
        minify = false,
    } = config;

    const outDirPath = path.join(extensionDir, outDir);
    const uiEntryPath = path.join(extensionDir, uiEntry);
    const handlersEntryPath = path.join(extensionDir, handlersEntry);

    // Create output directory
    if (!fs.existsSync(outDirPath)) {
        fs.mkdirSync(outDirPath, { recursive: true });
    }

    // Check entry points exist
    if (!fs.existsSync(uiEntryPath)) {
        throw new Error(`UI entry point not found: ${uiEntryPath}`);
    }
    if (!fs.existsSync(handlersEntryPath)) {
        throw new Error(`Handlers entry point not found: ${handlersEntryPath}`);
    }

    // Build UI bundle (for browser)
    const uiBundlePath = path.join(outDirPath, 'index.js');
    await esbuild.build({
        entryPoints: [uiEntryPath],
        bundle: true,
        outfile: uiBundlePath,
        format: 'iife',
        globalName: 'ExtensionExports',
        platform: 'browser',
        target: 'es2020',
        external: ['react', 'react-dom', '@gamecp/types/client', ...uiExternal],
        minify,
        sourcemap: false,
    });
    console.log('✅ UI bundle built: dist/index.js');

    // Build handlers bundle (for isolated-vm backend)
    const handlersBundlePath = path.join(outDirPath, 'handlers.js');
    await esbuild.build({
        entryPoints: [handlersEntryPath],
        bundle: true,
        outfile: handlersBundlePath,
        format: 'iife',
        globalName: 'ExtensionExports',
        platform: 'node',
        target: 'es2020',
        external: ['@gamecp/types', 'react', 'react-dom', ...handlersExternal],
        minify,
        sourcemap: false,
    });
    console.log('✅ Handlers bundle built: dist/handlers.js');

    // Read bundle sizes
    const uiBundleContent = fs.readFileSync(uiBundlePath, 'utf-8');
    const handlersBundleContent = fs.readFileSync(handlersBundlePath, 'utf-8');

    // Generate integrity hash from UI bundle
    const hash = crypto.createHash('sha384').update(uiBundleContent).digest('base64');
    const integrityHash = `sha384-${hash}`;

    console.log('');
    console.log(`📦 UI bundle: ${uiBundleContent.length.toLocaleString()} bytes`);
    console.log(`📦 Handlers bundle: ${handlersBundleContent.length.toLocaleString()} bytes`);
    console.log('');
    console.log(`🔐 Integrity hash: ${integrityHash}`);

    return {
        uiBundlePath,
        handlersBundlePath,
        uiBundleSize: uiBundleContent.length,
        handlersBundleSize: handlersBundleContent.length,
        integrityHash,
    };
}

/**
 * Bump version in gamecp.json
 */
export function bumpVersion(extensionDir: string, type: 'major' | 'minor' | 'patch'): string {
    const manifestPath = path.join(extensionDir, 'gamecp.json');
    
    if (!fs.existsSync(manifestPath)) {
        throw new Error('gamecp.json not found');
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const currentVersion = manifest.version || '0.0.0';
    const [major, minor, patch] = currentVersion.split('.').map(Number);

    let newVersion: string;
    switch (type) {
        case 'major':
            newVersion = `${major + 1}.0.0`;
            break;
        case 'minor':
            newVersion = `${major}.${minor + 1}.0`;
            break;
        case 'patch':
            newVersion = `${major}.${minor}.${patch + 1}`;
            break;
    }

    manifest.version = newVersion;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

    console.log(`✅ Version bumped: ${currentVersion} → ${newVersion}`);
    return newVersion;
}

/**
 * Create release package (build + copy assets + zip)
 */
export async function createRelease(extensionDir: string): Promise<string> {
    const manifestPath = path.join(extensionDir, 'gamecp.json');
    
    if (!fs.existsSync(manifestPath)) {
        throw new Error('gamecp.json not found');
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const extensionId = manifest.extension_id;
    const version = manifest.version;

    console.log(`📦 Creating release for ${extensionId} v${version}...`);
    console.log('');

    // Build the extension
    const buildResult = await buildExtension(extensionDir, { minify: true });

    // Update integrity hash in manifest
    manifest.integrity = buildResult.integrityHash;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    console.log('✅ Updated integrity hash in gamecp.json');
    console.log('');

    // Create release directory
    const releaseDir = path.join(extensionDir, 'release');
    if (fs.existsSync(releaseDir)) {
        fs.rmSync(releaseDir, { recursive: true });
    }
    fs.mkdirSync(releaseDir, { recursive: true });

    // Copy files to release
    const filesToCopy = [
        'gamecp.json',
        'README.md',
        'package.json',
        'dist',
        'assets',
    ];

    for (const file of filesToCopy) {
        const srcPath = path.join(extensionDir, file);
        const destPath = path.join(releaseDir, file);

        if (fs.existsSync(srcPath)) {
            if (fs.statSync(srcPath).isDirectory()) {
                copyDir(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
            console.log(`✅ Copied ${file}`);
        }
    }

    console.log('');
    console.log(`📦 Release prepared in: release/`);
    
    // Create zip file
    const zipPath = path.join(extensionDir, `${extensionId}-v${version}.zip`);
    await createZip(releaseDir, zipPath);
    
    console.log(`📦 Zip created: ${extensionId}-v${version}.zip`);
    console.log(`🎉 Extension ${extensionId} v${version} is ready for distribution!`);

    return releaseDir;
}

/**
 * Helper: Recursively copy directory
 */
function copyDir(src: string, dest: string) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

/**
 * Helper: Create zip archive from directory
 */
function createZip(sourceDir: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));

        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize();
    });
}

export default buildExtension;
