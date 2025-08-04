import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { jack } from 'jackspeak';
import { resolveCommand } from './commands/resolve.js';

const packagePath = join(import.meta.dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

/**
 * Create and configure the CLI
 */
export function createCLI() {
  const ack = jack({
    envPrefix: 'spectree',
    allowPositionals: true
  }).description(`${packageJson.description}

Usage:
  spectree <file>     Resolve @ references in a Markdown file

Examples:
  spectree input.md              # Output to stdout
  spectree input.md -o output.md # Output to file`);

  const j = ack
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
      }
    })
    .flag({
      help: {
        short: 'h',
        description: 'Show help',
        default: false
      }
    });

  return j;
}

/**
 * Parse the arguments and set configuration and positionals accordingly.
 */
function parse(j, argh) {
  j.loadEnvDefaults();
  const raw = j.parseRaw(argh);

  j.applyDefaults(raw);
  j.writeEnv(raw);

  return {
    command: resolveCommand,
    usage: () => j.usage(),
    values: raw.values,
    positionals: raw.positionals
  };
}

/**
 * Run the CLI
 */
export async function run(argv = process.argv) {
  const j = createCLI();
  const { command, values, positionals } = parse(j, argv);

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
  await command(values, inputFile);
}
