import fs from 'fs';

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