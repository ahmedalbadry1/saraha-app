import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { fileTypeFromBuffer, fileTypeFromFile } from "file-type";
import { exeption } from "../index.js";

export const fileTypes = {
  image: ["image/jpeg", "image/jpg", "image/png"],
  pdf: ["application/pdf"],
};

const generateUniqueFileName = (originalname) => {
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}-${originalname}`;
};

export const localUpload = ({
  storageFolder = "general",
  types = fileTypes.image,
  maxFileSize = 5 * 1024 * 1024,
  useMemoryStorage = false,
} = {}) => {
  const baseUploadDir = path.resolve("uploads", storageFolder);

  const storage = useMemoryStorage
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (req, file, cb) => {
          if (!fs.existsSync(baseUploadDir)) {
            fs.mkdirSync(baseUploadDir, { recursive: true });
          }
          cb(null, baseUploadDir);
        },
        filename: (req, file, cb) => {
          cb(null, generateUniqueFileName(file.originalname));
        },
      });

  const fileFilter = (req, file, cb) => {
    if (!types.includes(file.mimetype)) {
      try {
        exeption.BadRequest("Not allowed file type");
      } catch (err) {
        return cb(err, false);
      }
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSize,
    },
  });
};

const checkFile = async ({ file, storageFolder, types }) => {
  let result;

  if (file.path) {
    result = await fileTypeFromFile(file.path);
  } else if (file.buffer) {
    result = await fileTypeFromBuffer(file.buffer);
  }

  if (
    !result ||
    !types.includes(result.mime) ||
    (file.mimetype && result.mime !== file.mimetype)
  ) {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    exeption.Forbidden("Not allowed file type");
  }

  if (file.buffer) {
    const dirPath = path.resolve("uploads", storageFolder);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const fullPath = path.join(
      dirPath,
      generateUniqueFileName(file.originalname)
    );
    fs.writeFileSync(fullPath, file.buffer);
    file.path = fullPath;
  }

  return file;
};

export const processFiles = ({types = fileTypes.image,storageFolder = "general"} = {}) => {
  return async (req, res, next) => {
    try {
      if (req.file) {
        req.file = await checkFile({ file: req.file, storageFolder, types });
      } else if (Array.isArray(req.files) && req.files.length > 0) {
        let data = [];
        for (const file of req.files) {
          data.push(checkFile({ file, storageFolder, types }));
        }
        req.files = await Promise.all(data);
      } else if (typeof req.files == "object" &&req.files !== null &&Object.keys(req.files).length > 0) {
        for (const fieldName of Object.keys(req.files)) {
          const fieldFiles = req.files[fieldName];
          if (Array.isArray(fieldFiles)) {
            let fieldData = [];
            for (const file of fieldFiles) {
              fieldData.push(checkFile({ file, storageFolder, types }));
            }
            req.files[fieldName] = await Promise.all(fieldData);
          }
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};