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

  describe('run', () => {
    it('should show help when --help flag is used', async () => {
      const originalLog = console.log;
      let output = '';
      console.log = mock.fn((msg) => { output += msg; });

      await run(['node', 'spectree', '--help']);
      
      console.log = originalLog;
      assert(output.includes('Usage:'));
      assert(output.includes('spectree <file>'));
      assert(output.includes('Examples:'));
    });

    it('should show version when --version flag is used', async () => {
      const originalLog = console.log;
      let output = '';
      console.log = mock.fn((msg) => { output = msg; });

      await run(['node', 'spectree', '--version']);
      
      console.log = originalLog;
      assert.equal(output, '0.0.0');
    });

    it('should show error when no input file is provided', async () => {
      const originalError = console.error;
      const originalExit = process.exit;
      let errorOutput = '';
      let exitCode = null;
      
      console.error = mock.fn((msg) => { errorOutput += msg + '\n'; });
      process.exit = mock.fn((code) => { exitCode = code; });

      await run(['node', 'spectree']);
      
      console.error = originalError;
      process.exit = originalExit;
      
      assert(errorOutput.includes('Error: Input file required'));
      assert(errorOutput.includes('Try "spectree --help"'));
      assert.equal(exitCode, 1);
    });

    it.only('should handle short flags', async () => {
      const originalLog = console.log;
      let output = '';
      console.log = mock.fn((msg) => { output = msg; });

      await run(['node', 'spectree', '-v']);
      
      console.log = originalLog;
      assert.equal(output, '0.0.0');
    });
  });
});
