import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jack } from 'jackspeak';
import { resolveCommand } from './commands/resolve.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagePath = join(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

/**
 * Create and configure the CLI
 */
export function createCLI() {
  const j = jack({
    envPrefix: 'SPECTREE'
  })
    .opt({
      output: {
        short: 'o',
        description: 'Output file (default: stdout)',
        hint: 'FILE'
      }
    })
    .flag({
      version: {
        short: 'v',
        description: 'Show version'
      },
      help: {
        short: 'h',
        description: 'Show help'
      }
    })
    .description(`${packageJson.description}
    
Usage:
  spectree <file>     Resolve @ references in a Markdown file
  
Examples:
  spectree input.md              # Output to stdout
  spectree input.md -o output.md # Output to file`);

  return j;
}

/**
 * Run the CLI
 */
export async function run(argv = process.argv) {
  const j = createCLI();
  const { values, positionals } = j.parse(argv.slice(2));

  // Handle help flag
  if (values.help) {
    console.log(j.usage());
    return;
  }

  // Handle version flag
  if (values.version) {
    console.log(packageJson.version);
    return;
  }

  // Check for input file
  const inputFile = positionals[0];
  if (!inputFile) {
    console.error('Error: Input file required');
    console.error('Try "spectree --help" for more information');
    process.exit(1);
  }

  // Run resolve command
  await resolveCommand(values, inputFile);
}
