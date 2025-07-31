#!/usr/bin/env node

import { run } from '../src/index.js';

// Run the CLI
run().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});