import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  

  findOneImage(fileName: string) {

    const path = join(__dirname, '../../static/products', fileName)

    if(!existsSync(path)) {
      throw new BadRequestException(`No Product found with image ${ fileName }`)
    }

    return path
  }
}
