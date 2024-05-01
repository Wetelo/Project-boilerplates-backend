import { Module } from '@nestjs/common';
import { FileController } from './controllers/file.controller';
import { FileService } from './services/file.service';
import { FileS3Service } from './services/file-s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), LoggerModule],
  controllers: [FileController],
  providers: [FileService, FileS3Service],
})
export class FileModule {}
