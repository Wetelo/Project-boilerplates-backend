import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileService } from '../services/file.service';
import { randomUUID } from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MAX_FILE_SIZE, UPLOAD_FILE_PATH } from '../../common/constants/file';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ActiveUserGuard } from '../../auth/guards/active-user.guard';
import { GetJwtPayload } from '../../utils/decorators/jwt-payload.decorator';
import { JwtPayload } from '../../common/types/jwt-payload.type';
import { UploadFileApiDocs } from '../docs/upload-file.decorator';
import { GetFileApiDocs } from '../docs/get-file.decorator';
import { DeleteFileApiDocs } from '../docs/delete-file.decorator';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileLocal: FileService) {}

  @UploadFileApiDocs()
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
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
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
    ) // FOR ARRAY of files: Array<Express.Multer.File>)
    file: Express.Multer.File,
  ) {
    return await this.fileLocal.saveFile(file);
  }

  @GetFileApiDocs()
  @Get('/:id')
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
  async getFile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @GetJwtPayload() { id: userId }: JwtPayload,
  ) {
    const filename = await this.fileLocal.getFile(id, userId);
    return filename
      ? res.sendFile(filename, { root: UPLOAD_FILE_PATH })
      : res.end();
    // get from S3
    // return await this.fileLocal.getFile(id);
  }

  @DeleteFileApiDocs()
  @Delete('/:id')
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
  async deleteFile(
    @Param('id', ParseIntPipe) id: number,
    @GetJwtPayload() { id: userId }: JwtPayload,
  ) {
    return await this.fileLocal.deleteFile(id, userId);
  }
}
