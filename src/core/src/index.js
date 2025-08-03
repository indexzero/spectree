/**
 * SpecTree Core - Markdown transclusion library
 */

export { parseLine, parseReferences, isValidReference } from './parser.js';
export { Resolver, resolveFile } from './resolver.js';
export {
  resolveReferencePath,
  isPathWithinRoot,
  normalizePath,
  getDirname,
  joinPath
} from './path.js';
export { readFileContent, fileExists } from './file.js';
export {
  CircularReferenceError,
  FileNotFoundError,
  InvalidReferenceError,
  PathEscapeError,
  PermissionError
} from './errors.js';
