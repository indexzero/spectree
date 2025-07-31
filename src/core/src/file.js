import { readFile, access, constants } from 'node:fs/promises';
import { FileNotFoundError, PermissionError } from './errors.js';

/**
 * Read a file with UTF-8 encoding
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} File contents
 * @throws {FileNotFoundError} If file doesn't exist
 * @throws {PermissionError} If file can't be read
 */
export async function readFileContent(filePath) {
  try {
    await access(filePath, constants.R_OK);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new FileNotFoundError(filePath);
    }
    if (error.code === 'EACCES') {
      throw new PermissionError(filePath);
    }
    throw error;
  }
  
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'EACCES') {
      throw new PermissionError(filePath);
    }
    throw error;
  }
}

/**
 * Check if a file exists and is readable
 * @param {string} filePath - Path to check
 * @returns {Promise<boolean>} True if file exists and is readable
 */
export async function fileExists(filePath) {
  try {
    await access(filePath, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}