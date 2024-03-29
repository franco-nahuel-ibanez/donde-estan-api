import { v4 as uuid } from 'uuid';

export const fileNamer = (req: Express.Request, file: Express.Multer.File) => {
  if (!file) {
    throw new Error('No file was found');
  }

  const fileExtention = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${fileExtention}`;
  console.log('Filename:', fileName)
  return fileName;
};
