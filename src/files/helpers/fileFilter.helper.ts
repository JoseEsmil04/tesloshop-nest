

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

  if(!file) {
    return callback(new Error('File is Required'), false)
  }

  const fileExtension = file.mimetype.split('/').at(1)
  const validExtensions = ['png', 'jpg', 'jpeg', 'gif']

  if(validExtensions.includes(fileExtension)) {
    return callback(null, true)
  }

  callback(null, false)
}