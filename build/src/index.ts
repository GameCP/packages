/**
 * @gamecp/build - Build tools for GameCP extensions
 * 
 * Provides a standardized build process for all extensions:
 * - Separate UI bundle (for browser, React external)
 * - Separate handlers bundle (for isolated-vm backend)
 * - Automatic integrity hash generation
 */

import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

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
        external: ['@gamecp/types', ...handlersExternal],
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
    console.log('');
    console.log('Update gamecp.json with:');
    console.log(`  "integrity": "${integrityHash}"`);

    return {
        uiBundlePath,
        handlersBundlePath,
        uiBundleSize: uiBundleContent.length,
        handlersBundleSize: handlersBundleContent.length,
        integrityHash,
    };
}

export default buildExtension;
