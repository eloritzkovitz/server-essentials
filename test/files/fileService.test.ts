import * as fs from "fs";
import path from "path";
import {
  fileExists,
  getFileExtension,
  readFileAsString,
  writeFile,
  deleteFile,
} from "../../src/files/fileService";

jest.mock("fs", () => ({
  promises: {
    access: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    unlink: jest.fn(),
  },
  constants: { F_OK: 0 },
}));
const mockedFs = fs as any;

describe("fileService", () => {
  const testPath = path.join(__dirname, "test.txt");
  const testData = "Hello, world!";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fileExists returns true if file exists", async () => {
    mockedFs.promises.access.mockResolvedValue(undefined);
    await expect(fileExists(testPath)).resolves.toBe(true);
    expect(mockedFs.promises.access).toHaveBeenCalledWith(testPath, fs.constants.F_OK);
  });

  it("fileExists returns false if file does not exist", async () => {
    mockedFs.promises.access.mockRejectedValue(new Error("not found"));
    await expect(fileExists(testPath)).resolves.toBe(false);
  });

  it("getFileExtension returns file extension", () => {
    expect(getFileExtension("foo/bar.txt")).toBe(".txt");
    expect(getFileExtension("foo/bar")).toBe("");
  });

  it("readFileAsString reads file as string", async () => {
    mockedFs.promises.readFile.mockResolvedValue(testData);
    await expect(readFileAsString(testPath)).resolves.toBe(testData);
    expect(mockedFs.promises.readFile).toHaveBeenCalledWith(testPath, "utf8");
  });

  it("writeFile writes data to file", async () => {
    mockedFs.promises.writeFile.mockResolvedValue(undefined);
    await expect(writeFile(testPath, testData)).resolves.toBeUndefined();
    expect(mockedFs.promises.writeFile).toHaveBeenCalledWith(testPath, testData);
  });

  it("deleteFile deletes file successfully", async () => {
    mockedFs.promises.unlink.mockResolvedValue(undefined);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await expect(deleteFile(testPath)).resolves.toBeUndefined();
    expect(mockedFs.promises.unlink).toHaveBeenCalledWith(testPath);
    expect(consoleSpy).toHaveBeenCalledWith(`File deleted: ${testPath}`);
    consoleSpy.mockRestore();
  });

  it("deleteFile logs not found if file does not exist", async () => {
    const error = { code: "ENOENT" };
    mockedFs.promises.unlink.mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await expect(deleteFile(testPath)).resolves.toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(`File not found (not deleted): ${testPath}`);
    consoleSpy.mockRestore();
  });

  it("deleteFile logs warning for other errors", async () => {
    const error = { code: "EACCES", message: "Permission denied" };
    mockedFs.promises.unlink.mockRejectedValue(error);
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    await expect(deleteFile(testPath)).resolves.toBeUndefined();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `Error deleting file ${testPath}:`,
      error
    );
    consoleWarnSpy.mockRestore();
  });
});
