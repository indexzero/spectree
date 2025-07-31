import { resolve as resolvePath } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { resolveFile as resolveSpec } from '@spectree/core';

/**
 * Resolve command implementation
 * @param {Object} opts - Command options
 * @param {string} inputFile - Input file path
 */
export async function resolveCommand(opts, inputFile) {
  try {
    // Resolve the input file
    const absolutePath = resolvePath(inputFile);
    const resolvedContent = await resolveSpec(absolutePath);
    
    // Output the result
    if (opts.output) {
      // Write to file
      await writeFile(opts.output, resolvedContent, 'utf8');
      console.error(`Resolved content written to ${opts.output}`);
    } else {
      // Write to stdout
      process.stdout.write(resolvedContent);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}