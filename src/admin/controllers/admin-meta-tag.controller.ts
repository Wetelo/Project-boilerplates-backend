import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminMetaTagService } from '../services/admin-meta-tag.service';
import { CreateMetaTagDto } from '../dto/meta-tag/create-meta-tag.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UpdateMetaTagDto } from '../dto/meta-tag/update-meta-tag.dto';
import { MetaTagFilterDto } from '../dto/meta-tag/meta-tag-filter.dto';
import { AdminGetAllMetaTagApiDocs } from '../docs/meta-tag/admin-get-all-meta-tag-api-docs.decorator';
import { AdminGetMetaTagApiDocs } from '../docs/meta-tag/admin-get-meta-tag-api-docs.decorator';
import { AdminDeleteMetaTagApiDocs } from '../docs/meta-tag/admin-delete-meta-tag-api-docs.decorator';
import { AdminCreateMetaTagApiDocs } from '../docs/meta-tag/admin-create-meta-tag-api-docs.decorator';
import { AdminUpdateMetaTagApiDocsDecorator } from '../docs/meta-tag/admin-update-meta-tag-api-docs.decorator';

@ApiTags('admin/meta-tag')
@Controller('admin/meta-tag')
export class AdminMetaTagController {
  constructor(private readonly metaService: AdminMetaTagService) {}

  @AdminCreateMetaTagApiDocs()
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createDto: CreateMetaTagDto) {
    return await this.metaService.create(createDto);
  }

  @AdminUpdateMetaTagApiDocsDecorator()
  @Put('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMetaTagDto,
  ) {
    return await this.metaService.update(id, updateDto);
  }

  @AdminGetAllMetaTagApiDocs()
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAll(@Query() filterDto: MetaTagFilterDto) {
    return await this.metaService.getAll(filterDto);
  }

  @AdminGetMetaTagApiDocs()
  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.metaService.getOne(id);
  }

  @AdminDeleteMetaTagApiDocs()
  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.metaService.delete(id);
  }
}
