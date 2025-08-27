import fs from 'fs';
import path from 'path';

/**
 * Checks if a file exists.
 * @param filePath - The path to the file.
 * @returns Promise<boolean>
 */
export const fileExists = async (filePath: string): Promise<boolean> => {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
};

/**
 * Gets the file extension.
 * @param filePath - The path to the file.
 * @returns string
 */
export const getFileExtension = (filePath: string): string => {
    return path.extname(filePath);
};

/**
 * Reads a file as a string.
 * @param filePath - The path to the file.
 * @returns Promise<string>
 */
export const readFileAsString = async (filePath: string): Promise<string> => {
    return fs.promises.readFile(filePath, 'utf8');
};

/**
 * Writes data to a file.
 * @param filePath - The path to the file.
 * @param data - The data to write.
 * @returns Promise<void>
 */
export const writeFile = async (filePath: string, data: string | Buffer): Promise<void> => {
    await fs.promises.writeFile(filePath, data);
};

/**
 * Deletes a file from the filesystem.
 * @param filePath - The path to the file to be deleted.
 */
export const deleteFile = async (filePath: string): Promise<void> => {
    try {
        await fs.promises.unlink(filePath);
        console.log(`File deleted: ${filePath}`);
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            // File does not exist, not an error
            console.log(`File not found (not deleted): ${filePath}`);
        } else {
            // Log other errors but do not throw
            console.warn(`Error deleting file ${filePath}:`, err);
        }
    }
};