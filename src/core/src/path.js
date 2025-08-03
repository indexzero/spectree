import {
  dirname, join, resolve, relative, isAbsolute, normalize
} from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Resolve a reference path relative to the current file
 * @param {string} currentFilePath - Path of the file containing the reference
 * @param {string} referencePath - The referenced path
 * @returns {string} Resolved absolute path
 */
export function resolveReferencePath(currentFilePath, referencePath) {
  const currentDir = dirname(currentFilePath);
  return resolve(currentDir, referencePath);
}

/**
 * Check if a path escapes the root directory
 * @param {string} rootDir - Root directory path
 * @param {string} targetPath - Path to check
 * @returns {boolean} True if path is within root directory
 */
export function isPathWithinRoot(rootDir, targetPath) {
  const normalizedRoot = resolve(rootDir);
  const normalizedTarget = resolve(targetPath);
  const relativePath = relative(normalizedRoot, normalizedTarget);

  // If relative path starts with .., it's outside the root
  return !relativePath.startsWith('..') && !isAbsolute(relativePath);
}

/**
 * Normalize a file path for consistent handling
 * @param {string} filePath - Path to normalize
 * @returns {string} Normalized path
 */
export function normalizePath(filePath) {
  return normalize(filePath).replaceAll('\\', '/');
}

/**
 * Get the directory of the current module
 * @param {string} importMetaUrl - import.meta.url value
 * @returns {string} Directory path
 */
export function getDirname(importMetaUrl) {
  return dirname(fileURLToPath(importMetaUrl));
}

/**
 * Join path segments
 * @param {...string} segments - Path segments to join
 * @returns {string} Joined path
 */
export function joinPath(...segments) {
  return join(...segments);
}
