import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { parseLine, parseReferences, isValidReference } from '../src/parser.js';

describe('parseLine', () => {
  it('should parse valid @ reference', () => {
    const result = parseLine('@file.md');
    assert.equal(result.isReference, true);
    assert.equal(result.path, 'file.md');
  });

  it('should parse @ reference with path', () => {
    const result = parseLine('@path/to/file.md');
    assert.equal(result.isReference, true);
    assert.equal(result.path, 'path/to/file.md');
  });

  it('should reject reference with leading whitespace', () => {
    const result = parseLine('  @file.md');
    assert.equal(result.isReference, false);
  });

  it('should reject reference not at start of line', () => {
    const result = parseLine('text @file.md');
    assert.equal(result.isReference, false);
  });

  it('should reject reference without .md extension', () => {
    const result = parseLine('@file.txt');
    assert.equal(result.isReference, false);
  });

  it('should reject empty @ reference', () => {
    const result = parseLine('@');
    assert.equal(result.isReference, false);
  });

  it('should reject double @@ reference', () => {
    const result = parseLine('@@file.md');
    assert.equal(result.isReference, false);
  });
});

describe('parseReferences', () => {
  it('should find all references in content', () => {
    const content = `# Title
@first.md
Some text
@second.md
More text`;

    const references = parseReferences(content);
    assert.equal(references.length, 2);
    assert.deepEqual(references[0], { line: 2, path: 'first.md' });
    assert.deepEqual(references[1], { line: 4, path: 'second.md' });
  });

  it('should handle content with no references', () => {
    const content = `# Title
Just regular markdown
No references here`;

    const references = parseReferences(content);
    assert.equal(references.length, 0);
  });
});

describe('isValidReference', () => {
  it('should return true for valid reference', () => {
    assert.equal(isValidReference('@file.md'), true);
  });

  it('should return false for invalid reference', () => {
    assert.equal(isValidReference('not a reference'), false);
  });
});
