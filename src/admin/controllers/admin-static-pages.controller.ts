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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
import { StaticPagesService } from 'src/static-pages/services/static-pages.service';
import { GetAllStaticPagesApiDocs } from 'src/static-pages/docs/static-page/get-all-static-pages-api-docs.decorator';
import { GetStaticPageApiDocs } from 'src/static-pages/docs/static-page/get-static-page-api-docs.decorator';
import { GetAllStaticPagesFiltersDto } from 'src/static-pages/dto/get-all-static-pages-filters.dto';
import { CreateStaticPageDto } from 'src/static-pages/dto/create-static-page.dto';
import { CreateStaticPageApiDocs } from 'src/static-pages/docs/static-page/create-static-page-api-docs.decorator';
import { UpdateStaticPageApiDocs } from 'src/static-pages/docs/static-page/update-static-page-api-docs.decorator';
import { UpdateStaticPageDto } from 'src/static-pages/dto/update-static-page.dto';
import { DeleteStaticPageApiDocs } from 'src/static-pages/docs/static-page/delete-static-page-api-docs.decorator';

@ApiTags('admin/static-pages')
@Controller('admin/static-pages')
export class AdminStaticPagesController {
  constructor(private readonly staticPagesService: StaticPagesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @GetAllStaticPagesApiDocs()
  async getStaticPages(@Query() filters: GetAllStaticPagesFiltersDto) {
    return await this.staticPagesService.getStaticPages(filters);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @GetStaticPageApiDocs()
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.staticPagesService.findOneById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @CreateStaticPageApiDocs()
  async createStaticPage(@Body() staticPageDto: CreateStaticPageDto) {
    return await this.staticPagesService.create(staticPageDto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UpdateStaticPageApiDocs()
  async updateStaticPage(
    @Param('id', ParseIntPipe) id: number,
    @Body() staticPageDto: UpdateStaticPageDto,
  ) {
    return await this.staticPagesService.update(id, staticPageDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @DeleteStaticPageApiDocs()
  async deleteStaticPage(@Param('id', ParseIntPipe) id: number) {
    return await this.staticPagesService.delete(id);
  }
}
