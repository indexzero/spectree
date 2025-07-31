import { describe, it, expect } from 'vitest';
import { parseLine, parseReferences, isValidReference } from '../src/parser.js';

describe('parseLine', () => {
  it('should parse valid @ reference', () => {
    const result = parseLine('@file.md');
    expect(result.isReference).toBe(true);
    expect(result.path).toBe('file.md');
  });
  
  it('should parse @ reference with path', () => {
    const result = parseLine('@path/to/file.md');
    expect(result.isReference).toBe(true);
    expect(result.path).toBe('path/to/file.md');
  });
  
  it('should reject reference with leading whitespace', () => {
    const result = parseLine('  @file.md');
    expect(result.isReference).toBe(false);
  });
  
  it('should reject reference not at start of line', () => {
    const result = parseLine('text @file.md');
    expect(result.isReference).toBe(false);
  });
  
  it('should reject reference without .md extension', () => {
    const result = parseLine('@file.txt');
    expect(result.isReference).toBe(false);
  });
  
  it('should reject empty @ reference', () => {
    const result = parseLine('@');
    expect(result.isReference).toBe(false);
  });
  
  it('should reject double @@ reference', () => {
    const result = parseLine('@@file.md');
    expect(result.isReference).toBe(false);
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
    expect(references).toHaveLength(2);
    expect(references[0]).toEqual({ line: 2, path: 'first.md' });
    expect(references[1]).toEqual({ line: 4, path: 'second.md' });
  });
  
  it('should handle content with no references', () => {
    const content = `# Title
Just regular markdown
No references here`;
    
    const references = parseReferences(content);
    expect(references).toHaveLength(0);
  });
});

describe('isValidReference', () => {
  it('should return true for valid reference', () => {
    expect(isValidReference('@file.md')).toBe(true);
  });
  
  it('should return false for invalid reference', () => {
    expect(isValidReference('not a reference')).toBe(false);
  });
});