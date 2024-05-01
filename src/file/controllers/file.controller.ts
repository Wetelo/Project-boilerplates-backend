import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileService } from '../services/file.service';
import { randomUUID } from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MAX_FILE_SIZE, UPLOAD_FILE_PATH } from '../../common/constants/file';
import { diskStorage } from 'multer';
import { Response } from 'express';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileLocal: FileService) {}
  //TODO add apidoc, add guards
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_FILE_PATH || './uploads/public/',
        filename: (_, file, cb) => {
          cb(null, `${randomUUID()}-${file.originalname.replace(/\s/g, '-')}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addFileTypeValidator({
          fileType: 'png',
        })
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .addFileTypeValidator({
          fileType: 'pdf',
        })
        .addMaxSizeValidator({
          maxSize: MAX_FILE_SIZE,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return await this.fileLocal.saveFile(file);
  }

  @Get('/:id')
  async getFile(@Query('id', ParseIntPipe) id: number, @Res() res: Response) {
    const filename = await this.fileLocal.getFile(id);
    return filename
      ? res.sendFile(filename, { root: UPLOAD_FILE_PATH })
      : res.end();
    // get from S3
    // return await this.fileLocal.getFile(id);
  }

  @Delete('/:id')
  async deleteFile(@Query('id', ParseIntPipe) id: number) {
    return await this.fileLocal.deleteFile(id);
  }
}
