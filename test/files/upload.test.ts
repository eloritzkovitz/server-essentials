import { Request } from "express";
import {
  uploadDir,
  storageConfig,
  imageFileFilter,
  documentFileFilter,
  anyFileFilter,
  createUpload,
  upload,
  uploadImage,
  uploadDocument,
} from "../../src/files/upload";

describe("upload.ts", () => {
  it("storage sets destination", () => {
    const req = {} as Request;
    const file = { originalname: "file.txt" } as Partial<Express.Multer.File>;
    const cb = jest.fn() as (error: Error | null, destination?: string) => void;

    storageConfig.destination(req, file as Express.Multer.File, cb);
    expect(cb).toHaveBeenCalledWith(null, uploadDir);
  });

  it("storage sets filename", () => {
    const req = {} as Request;
    const file = { originalname: "file.txt" } as Partial<Express.Multer.File>;
    const cb = jest.fn() as jest.Mock;

    storageConfig.filename(req, file as Express.Multer.File, cb);
    expect(cb.mock.calls[0][1]).toMatch(/^\d+-file\.txt$/);
  });

  describe("imageFileFilter", () => {
    it("accepts jpeg image", () => {
      const file = { originalname: "photo.jpeg", mimetype: "image/jpeg" };
      const cb = jest.fn();
      imageFileFilter({}, file, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it("accepts png image", () => {
      const file = { originalname: "photo.png", mimetype: "image/png" };
      const cb = jest.fn();
      imageFileFilter({}, file, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it("rejects non-image file", () => {
      const file = { originalname: "doc.pdf", mimetype: "application/pdf" };
      const cb = jest.fn();
      imageFileFilter({}, file, cb);
      expect(cb.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe("documentFileFilter", () => {
    it("accepts pdf", () => {
      const file = { originalname: "doc.pdf", mimetype: "application/pdf" };
      const cb = jest.fn();
      documentFileFilter({}, file, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it("accepts docx", () => {
      const file = {
        originalname: "doc.docx",
        mimetype:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
      const cb = jest.fn();
      documentFileFilter({}, file, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it("rejects image file", () => {
      const file = { originalname: "photo.jpg", mimetype: "image/jpeg" };
      const cb = jest.fn();
      documentFileFilter({}, file, cb);
      expect(cb.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });

  describe("anyFileFilter", () => {
    it("accepts any file", () => {
      const file = {
        originalname: "anything.any",
        mimetype: "application/octet-stream",
      };
      const cb = jest.fn();
      anyFileFilter({}, file, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    });
  });

  it("createUpload returns an object with multer methods", () => {
    const instance = createUpload();
    expect(typeof instance.single).toBe("function");
    expect(typeof instance.array).toBe("function");
  });

  it("upload has multer methods", () => {
    expect(typeof upload.single).toBe("function");
    expect(typeof upload.array).toBe("function");
  });

  it("uploadImage has multer methods", () => {
    expect(typeof uploadImage.single).toBe("function");
    expect(typeof uploadImage.array).toBe("function");
  });

  it("uploadDocument has multer methods", () => {
    expect(typeof uploadDocument.single).toBe("function");
    expect(typeof uploadDocument.array).toBe("function");
  });
});
