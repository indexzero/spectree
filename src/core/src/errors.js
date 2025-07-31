/**
 * Custom error classes for SpecTree
 */

/**
 * Error thrown when a circular reference is detected
 */
export class CircularReferenceError extends Error {
  constructor(path, chain) {
    const message = `Circular reference detected: ${chain.join(' -> ')} -> ${path}`;
    super(message);
    this.name = 'CircularReferenceError';
    this.path = path;
    this.chain = chain;
  }
}

/**
 * Error thrown when a referenced file is not found
 */
export class FileNotFoundError extends Error {
  constructor(path, referencedFrom) {
    const message = `File not found: ${path}${referencedFrom ? ` (referenced from ${referencedFrom})` : ''}`;
    super(message);
    this.name = 'FileNotFoundError';
    this.path = path;
    this.referencedFrom = referencedFrom;
  }
}

/**
 * Error thrown when a reference path is invalid
 */
export class InvalidReferenceError extends Error {
  constructor(reference, reason) {
    const message = `Invalid reference: ${reference}${reason ? ` - ${reason}` : ''}`;
    super(message);
    this.name = 'InvalidReferenceError';
    this.reference = reference;
    this.reason = reason;
  }
}

/**
 * Error thrown when a path escapes the root directory
 */
export class PathEscapeError extends Error {
  constructor(path, rootDir) {
    const message = `Path escapes root directory: ${path} (root: ${rootDir})`;
    super(message);
    this.name = 'PathEscapeError';
    this.path = path;
    this.rootDir = rootDir;
  }
}

/**
 * Error thrown when file permissions prevent access
 */
export class PermissionError extends Error {
  constructor(path, operation = 'read') {
    const message = `Permission denied: Cannot ${operation} file ${path}`;
    super(message);
    this.name = 'PermissionError';
    this.path = path;
    this.operation = operation;
  }
}