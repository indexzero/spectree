#!/usr/bin/env node

import { run } from '../src/index.js';

// Run the CLI
run().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
