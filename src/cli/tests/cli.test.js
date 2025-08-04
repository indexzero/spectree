import { describe, it, mock } from 'node:test';
import { strict as assert } from 'node:assert';
import { createCLI, run } from '../src/cli.js';

describe('CLI', () => {
  describe('createCLI', () => {
    it('should create a CLI with proper configuration', () => {
      const cli = createCLI();
      
      assert(cli);
      assert(cli.parse);
      assert(cli.usage);
    });

    it('should have expected options', () => {
      const cli = createCLI();
      
      // Check that CLI configuration includes expected options
      const usage = cli.usage();
      assert(usage.includes('--output'));
      assert(usage.includes('--version'));
      assert(usage.includes('--help'));
      assert(usage.includes('-o'));
      assert(usage.includes('-v'));
      assert(usage.includes('-h'));
    });
  });
});
