/**
 * Parser for identifying @ references in Markdown content
 */

const REFERENCE_PATTERN = /^@([^@].+\.md)$/;

/**
 * Parse a single line to check if it's a valid @ reference
 * @param {string} line - The line to parse
 * @returns {{isReference: boolean, path?: string}} Parse result
 */
export function parseLine(line) {
  const match = line.match(REFERENCE_PATTERN);
  
  if (!match) {
    return { isReference: false };
  }
  
  return {
    isReference: true,
    path: match[1]
  };
}

/**
 * Parse content to find all @ references
 * @param {string} content - The content to parse
 * @returns {Array<{line: number, path: string}>} Array of references with line numbers
 */
export function parseReferences(content) {
  const lines = content.split('\n');
  const references = [];
  
  for (let i = 0; i < lines.length; i++) {
    const result = parseLine(lines[i]);
    if (result.isReference) {
      references.push({
        line: i + 1,
        path: result.path
      });
    }
  }
  
  return references;
}

/**
 * Check if a line contains a valid @ reference
 * @param {string} line - The line to check
 * @returns {boolean} True if the line is a valid reference
 */
export function isValidReference(line) {
  return parseLine(line).isReference;
}