import { Request } from 'express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';

type nameFnType = (req: Request, file: Express.Multer.File) => string;
type validatorFn = (req: Request, file: Express.Multer.File) => string | null;

type Options = {
  destination: string;
  filename: nameFnType;
  validator?: validatorFn;
};

interface CustomFileResult extends Partial<Express.Multer.File> {
  name: string;
}

class CustomStorageEngine implements multer.StorageEngine {
  private destination: string;
  private nameFn: nameFnType;
  private validator?: validatorFn;

  constructor(opts: Options) {
    this.destination = opts.destination || './files';
    this.nameFn = opts.filename;
    this.validator = opts.validator || undefined;
  }

  _handleFile = (
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, info?: CustomFileResult) => void,
  ): void => {  
    console.log(1)
    if (this.validator) {
      // Validator is defined
      const validationError = this.validator(req, file);

      console.log(2)

      if (validationError) {
        console.log('Validation error:', validationError);
        // If validator function returned a string which means there was an error
        cb(new Error(validationError));
        return;
      }
    }

    console.log(3)

    let filename: string;
    try {
      filename = this.nameFn(req, file);
      console.log('Filename:', filename)
    } catch (error) {
      console.log('Error:', error);
      return cb(error);
    }

    const fullPath = path.resolve(this.destination, filename);

    console.log(4, fullPath)

    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    file.path = fullPath;
    file.filename = filename;
    let stream: sharp.Sharp = undefined;

    if (extname && mimetype) {
      const sharpCompress = sharp({
        failOnError: false
      }).jpeg({
        quality: +process.env.PHOTO_QUALITY_PERCENTAGE,
      });
      stream = file.stream.pipe(sharpCompress);
    }

    fs.promises
      .writeFile(fullPath, extname && mimetype ? stream : file.stream)
      .then(
        () => cb(null),
        (reason) => cb(reason),
      );

    console.log(5)
    return;
  };

  _removeFile = (
    req: Request,
    file: Express.Multer.File & { name: string },
    cb: (error: Error | null) => void,
  ): void => {
    console.log(6)
    let filename: string;
    try {
      filename = this.nameFn(req, file);
    } catch (error) {
      return cb(error);
    }
    console.log(7)
    const fullPath = path.resolve(this.destination, filename);

    console.log(8)
    fs.promises.unlink(fullPath).then(
      () => cb(null),
      (reason) => cb(reason),
    );
    console.log(9)
  };
}

export function CompressedDiskStorageEngine(
  opts: Options,
): CustomStorageEngine {
  return new CustomStorageEngine(opts);
}
