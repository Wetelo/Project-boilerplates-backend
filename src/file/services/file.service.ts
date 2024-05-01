import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FileEntity } from '../entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fs from 'fs';
import { UPLOAD_FILE_PATH } from '../../common/constants/file';
//import { FileS3Service } from './file-s3.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    //private readonly fileS3: FileS3Service,
  ) {}

  async saveFile(file: Express.Multer.File) {
    const fileEntity = await this.fileRepository.findOne({
      where: { fileName: file.filename },
    });
    if (fileEntity) {
      throw new BadRequestException('File already exists');
    }
    const newFile = await this.fileRepository.save({
      fileName: file.filename,
    });
    // upload to S3
    // await this.fileS3.uploadFile(
    //   file.filename,
    //   UPLOAD_FILE_PATH + file.filename,
    // );
    return {
      id: newFile.id,
    };
  }

  async getFile(id) {
    const file = await this.fileRepository.findOne({
      where: {
        id,
      },
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file.fileName;
    // get from S3
    // return await this.fileS3.downloadFile(file.fileName);
  }

  async deleteFile(id) {
    const file = await this.fileRepository.findOne({
      where: {
        id,
      },
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    const filePath = UPLOAD_FILE_PATH + '/' + file.fileName;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    //delete from S3
    //await this.fileS3.removeFile(file.fileName);
    await this.fileRepository.delete({ id });
  }
}
