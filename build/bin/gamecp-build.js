#!/usr/bin/env node

/**
 * GameCP Extension Build CLI
 * 
 * Usage:
 *   gamecp-build                    - Build extension to dist/
 *   gamecp-build version <type>     - Bump version (major, minor, or patch)
 *   gamecp-build release            - Build, package, and prepare for distribution
 */

import { buildExtension, bumpVersion, createRelease } from '../dist/index.js';

const cwd = process.cwd();
const command = process.argv[2];
const arg = process.argv[3];

async function main() {
    try {
        if (!command || command === 'build') {
            // Default: build extension
            console.log('🔨 Building extension...\n');
            await buildExtension(cwd);
            console.log('\n✅ Build complete!');
            console.log('\n💡 Tip: Update the integrity hash in gamecp.json');
        }
        else if (command === 'version') {
            // Bump version
            if (!arg || !['major', 'minor', 'patch'].includes(arg)) {
                console.error('❌ Usage: gamecp-build version <major|minor|patch>');
                process.exit(1);
            }
            const versionType = arg;
            bumpVersion(cwd, versionType);
        }
        else if (command === 'release') {
            // Create release package
            await createRelease(cwd);
        }
        else {
            console.error('❌ Unknown command:', command);
            console.log('\nUsage:');
            console.log('  gamecp-build                    - Build extension');
            console.log('  gamecp-build version <type>     - Bump version (major, minor, patch)');
            console.log('  gamecp-build release            - Create release package');
            process.exit(1);
        }
    } catch (err) {
        console.error('❌ Build failed:', err.message);
        process.exit(1);
    }
}

main();
