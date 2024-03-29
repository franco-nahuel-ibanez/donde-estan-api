export const fileFilter = (req: any, file: Express.Multer.File, callback: Function ) => {
  const fileExtention = file.mimetype.split('/')[1];
  const validExtention = ['jpeg', 'jpg', 'png', 'pdf'];

  if(validExtention.includes(fileExtention)) {
    console.log("entro al fileFilter")
    return callback(null, true);
  }
  req.fileValidationError = "La Foto solo acepta imagenes en formato jpeg, jpg y png";
  return callback(null, false, new Error('La Foto solo acepta imagenes en formato jpeg, jpg y png'));

}