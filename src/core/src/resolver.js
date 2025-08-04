import { dirname, resolve } from 'node:path';
import { parseLine } from './parser.js';
import { resolveReferencePath, isPathWithinRoot } from './path.js';
import { readFileContent } from './file.js';
import { CircularReferenceError, PathEscapeError } from './errors.js';

/**
 * Resolve all @ references in a file recursively
 */
export class Resolver {
  constructor(options = {}) {
    this.rootDir = options.rootDir || null;
    this.processingStack = new Set();
  }

  /**
   * Resolve a single file and all its references
   * @param {string} filePath - Path to the file to resolve
   * @returns {Promise<string>} Resolved content
   */
  async resolveFile(filePath) {
    const absolutePath = resolve(filePath);

    // Set root directory from the first file if not already set
    this.rootDir ||= dirname(absolutePath);

    // Check for circular reference
    if (this.processingStack.has(absolutePath)) {
      throw new CircularReferenceError(absolutePath, [...this.processingStack]);
    }

    // Add to processing stack
    this.processingStack.add(absolutePath);

    try {
      const content = await readFileContent(absolutePath);
      const resolvedContent = await this.resolveContent(content, absolutePath);

      // Remove from processing stack
      this.processingStack.delete(absolutePath);

      return resolvedContent;
    } catch (err) {
      // Clean up processing stack on error
      this.processingStack.delete(absolutePath);
      throw err;
    }
  }

  /**
   * Resolve @ references in content
   * @param {string} content - Content to process
   * @param {string} currentFilePath - Path of the current file
   * @returns {Promise<string>} Resolved content
   */
  async resolveContent(content, currentFilePath) {
    const lines = content.split('\n');
    const resolvedLines = [];

    // Process all lines and collect promises for references
    const linePromises = lines.map(async (line, index) => {
      const parseResult = parseLine(line);

      if (parseResult.isReference) {
        // Resolve the reference
        const referencedPath = resolveReferencePath(currentFilePath, parseResult.path);

        // Check if path escapes root directory
        if (!isPathWithinRoot(this.rootDir, referencedPath)) {
          throw new PathEscapeError(parseResult.path, this.rootDir);
        }

        // Recursively resolve the referenced file
        const resolvedContent = await this.resolveFile(referencedPath);

        // Replace the reference line with the resolved content
        // Remove trailing newline if it exists to avoid double newlines
        const contentToAdd = resolvedContent.endsWith('\n')
          ? resolvedContent.slice(0, -1)
          : resolvedContent;
        return { index, content: contentToAdd };
      }

      // Keep the line as-is
      return { index, content: line };
    });

    // Wait for all promises to resolve
    const results = await Promise.all(linePromises);

    // Sort by index to maintain order and extract content
    results.sort((a, b) => a.index - b.index);
    for (const result of results) {
      resolvedLines.push(result.content);
    }

    return resolvedLines.join('\n');
  }
}

/**
 * Convenience function to resolve a file
 * @param {string} filePath - Path to the file to resolve
 * @param {Object} options - Resolver options
 * @returns {Promise<string>} Resolved content
 */
export async function resolveFile(filePath, options = {}) {
  const resolver = new Resolver(options);
  return resolver.resolveFile(filePath);
}
