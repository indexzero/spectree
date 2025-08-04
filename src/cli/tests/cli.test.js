import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { createCLI } from '../src/cli.js';

describe('CLI', () => {
  describe('createCLI', () => {
    it('should create a CLI with proper configuration', () => {
      const cli = createCLI();

      assert.ok(cli);
      assert.ok(cli.parse);
      assert.ok(cli.usage);
    });

    it('should have expected options', () => {
      const cli = createCLI();

      // Check that CLI configuration includes expected options
      const usage = cli.usage();
      assert.ok(usage.includes('--output'));
      assert.ok(usage.includes('--version'));
      assert.ok(usage.includes('--help'));
      assert.ok(usage.includes('-o'));
      assert.ok(usage.includes('-v'));
      assert.ok(usage.includes('-h'));
    });
  });
});
