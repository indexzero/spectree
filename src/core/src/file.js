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
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new FileNotFoundError(filePath);
    }

    if (err.code === 'EACCES') {
      throw new PermissionError(filePath);
    }

    throw err;
  }

  try {
    return await readFile(filePath, 'utf8');
  } catch (err) {
    if (err.code === 'EACCES') {
      throw new PermissionError(filePath);
    }

    throw err;
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
