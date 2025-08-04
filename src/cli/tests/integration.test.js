import { describe, it, beforeEach, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { readFile, rm } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFile = promisify(spawn);
const binPath = join(import.meta.dirname, '..', 'bin', 'spectree.js');
const fixturesDir = join(import.meta.dirname, 'fixtures');

/**
 * Helper to run the CLI binary
 */
async function runCLI(args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [binPath, ...args], {
      cwd: options.cwd || process.cwd(),
      env: { ...process.env, ...options.env }
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });

    child.on('error', reject);
  });
}

describe('CLI Integration Tests', () => {
  const outputPath = join(fixturesDir, 'integration-output.md');

  afterEach(async () => {
    // Clean up output file if it exists
    try {
      await rm(outputPath);
    } catch {
      // File doesn't exist, that's fine
    }
  });

  it('should show help when run without arguments', async () => {
    const { code, stdout, stderr } = await runCLI([]);
    
    assert.equal(code, 1);
    assert(stderr.includes('Error: Input file required'));
    assert(stderr.includes('Try "spectree --help"'));
  });

  it('should show help with --help flag', async () => {
    const { code, stdout } = await runCLI(['--help']);
    
    assert.equal(code, 0);
    assert(stdout.includes('CLI for SpecTree Markdown transclusion'));
    assert(stdout.includes('Usage:'));
    assert(stdout.includes('spectree <file>'));
    assert(stdout.includes('Examples:'));
  });

  it('should show version with --version flag', async () => {
    const { code, stdout } = await runCLI(['--version']);
    
    assert.equal(code, 0);
    assert(stdout.includes('0.0.0'));
  });

  it('should show help with -h short flag', async () => {
    const { code, stdout } = await runCLI(['-h']);
    
    assert.equal(code, 0);
    assert(stdout.includes('CLI for SpecTree Markdown transclusion'));
    assert(stdout.includes('Usage:'));
    assert(stdout.includes('spectree <file>'));
  });

  it('should show version with -v short flag', async () => {
    const { code, stdout } = await runCLI(['-v']);
    
    assert.equal(code, 0);
    assert(stdout.includes('0.0.0'));
  });

  it('should resolve a simple file', async () => {
    const inputFile = join(fixturesDir, 'simple.md');
    const { code, stdout } = await runCLI([inputFile]);
    
    assert.equal(code, 0);
    assert.equal(stdout, '# Simple Document\n\nThis document has no references.');
  });

  it('should resolve a file with references', async () => {
    const inputFile = join(fixturesDir, 'main.md');
    const { code, stdout } = await runCLI([inputFile]);
    
    assert.equal(code, 0);
    assert(stdout.includes('# Main Document'));
    assert(stdout.includes('## Header'));
    assert(stdout.includes('## Footer'));
    assert(!stdout.includes('@./includes/'));
  });

  it('should write to output file with -o flag', async () => {
    const inputFile = join(fixturesDir, 'main.md');
    const { code, stderr } = await runCLI([inputFile, '-o', outputPath]);
    
    assert.equal(code, 0);
    assert(stderr.includes(`Resolved content written to ${outputPath}`));
    
    const content = await readFile(outputPath, 'utf8');
    assert(content.includes('# Main Document'));
    assert(content.includes('## Header'));
    assert(content.includes('## Footer'));
  });

  it('should handle non-existent file error', async () => {
    const { code, stderr } = await runCLI(['non-existent.md']);
    
    assert.equal(code, 1);
    assert(stderr.includes('Error:'));
    assert(stderr.includes('File not found'));
  });

  it('should respect SPECTREE_ environment variables', async () => {
    // Skipping: Environment variable handling needs to be implemented after jackspeak parsing
    const inputFile = join(fixturesDir, 'simple.md');
    const { code, stderr } = await runCLI([inputFile], {
      env: { SPECTREE_OUTPUT: outputPath }
    });
    
    assert.equal(code, 0);
    assert(stderr.includes(`Resolved content written to ${outputPath}`));
    
    const content = await readFile(outputPath, 'utf8');
    assert.equal(content, '# Simple Document\n\nThis document has no references.');
  });

  it('should handle unexpected errors gracefully', async () => {
    // Create a test that triggers an unexpected error by using a directory as input
    const { code, stderr } = await runCLI([fixturesDir]);
    
    assert.equal(code, 1);
    assert(stderr.includes('Error:'));
  });
});
