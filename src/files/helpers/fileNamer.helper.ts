import { randomUUID } from "crypto"


export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

  if(!file) {
    return callback(new Error('File is Required'), false)
  }

  const fileExtension = file.mimetype.split('/').at(1)
  const fileName = `${ randomUUID() }.${fileExtension}`

  callback(null, fileName)
}