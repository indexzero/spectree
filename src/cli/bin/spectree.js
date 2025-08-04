#!/usr/bin/env node

import process from 'node:process';
import { run } from '../src/index.js';

// Run the CLI
try {
  await run();
} catch (err) {
  console.error('Unexpected error:', err);
  process.exit(1);
}
