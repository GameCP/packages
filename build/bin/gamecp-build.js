#!/usr/bin/env node

/**
 * GameCP Extension Build CLI
 * 
 * Usage: npx @gamecp/build
 * 
 * This builds your extension with the correct configuration:
 * - Separate UI bundle (for browser, React external)
 * - Separate handlers bundle (for isolated-vm, no React)
 * - Generates integrity hash
 */

import { buildExtension } from '../dist/index.js';

const cwd = process.cwd();

buildExtension(cwd).catch(err => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});
