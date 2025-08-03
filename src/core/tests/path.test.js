import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { resolve, dirname } from 'node:path';
import {
  resolveReferencePath,
  isPathWithinRoot,
  normalizePath
} from '../src/path.js';

describe('resolveReferencePath', () => {
  it('should resolve relative path from current file', () => {
    const currentFile = '/project/docs/index.md';
    const reference = 'sub/page.md';
    const resolved = resolveReferencePath(currentFile, reference);
    assert.equal(resolved, resolve('/project/docs/sub/page.md'));
  });

  it('should resolve parent directory reference', () => {
    const currentFile = '/project/docs/sub/page.md';
    const reference = '../index.md';
    const resolved = resolveReferencePath(currentFile, reference);
    assert.equal(resolved, resolve('/project/docs/index.md'));
  });

  it('should resolve same directory reference', () => {
    const currentFile = '/project/docs/index.md';
    const reference = './sibling.md';
    const resolved = resolveReferencePath(currentFile, reference);
    assert.equal(resolved, resolve('/project/docs/sibling.md'));
  });
});

describe('isPathWithinRoot', () => {
  it('should return true for path within root', () => {
    const root = '/project';
    const path = '/project/docs/file.md';
    assert.equal(isPathWithinRoot(root, path), true);
  });

  it('should return false for path outside root', () => {
    const root = '/project';
    const path = '/other/file.md';
    assert.equal(isPathWithinRoot(root, path), false);
  });

  it('should return false for path escaping with ..', () => {
    const root = '/project/docs';
    const path = '/project/docs/../../../etc/passwd';
    assert.equal(isPathWithinRoot(root, path), false);
  });

  it('should handle relative paths correctly', () => {
    const root = process.cwd();
    const path = resolve(root, 'subdir/file.md');
    assert.equal(isPathWithinRoot(root, path), true);
  });
});

describe('normalizePath', () => {
  it('should normalize path separators', () => {
    const path = String.raw`path\to\file.md`;
    assert.equal(normalizePath(path), 'path/to/file.md');
  });

  it('should handle already normalized paths', () => {
    const path = 'path/to/file.md';
    assert.equal(normalizePath(path), 'path/to/file.md');
  });
});
