import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StaticPage } from '../entities/static-pages.entity';
import { Not, Repository, SelectQueryBuilder } from 'typeorm';
import { GetAllStaticPagesFiltersDto } from '../dto/get-all-static-pages-filters.dto';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { GetAllStaticPagesResponseDto } from '../dto/get-all-static-pages-response.dto';
import { UpdateStaticPageDto } from '../dto/update-static-page.dto';
import { CreateStaticPageDto } from '../dto/create-static-page.dto';
import { StaticPageType } from '../types/static-page.type';
import { PAGINATION_DEFAULT_SETTINGS } from '../../common/constants/pagination';
import { SortOrderEnum } from 'src/common/enums/sort-order.enum';
import { ENTITIES } from '../../common/enums/entities';
import { StaticPageLang } from '../entities/static-pages-lang.entity';
import { StaticPageLangType } from '../types/static-page-lang.type';

@Injectable()
export class StaticPagesService {
  constructor(
    @InjectRepository(StaticPage)
    private readonly staticPageRepository: Repository<StaticPage>,
    @Inject(ENTITIES.STATIC_PAGES)
    private readonly staticPage: StaticPageType,
    @Inject(ENTITIES.STATIC_PAGE_LANG)
    private readonly staticPageLang: StaticPageLangType,
  ) {}
  async findOneBySlug(slug: string) {
    const staticPage = await this.staticPageRepository.findOne({
      where: { slug, noIndex: false },
      relations: {
        translations: true,
      },
    });

    if (!staticPage) {
      throw new NotFoundException('Page not found');
    }

    return staticPage;
  }

  async findOneById(id: number) {
    const staticPage = await this.staticPageRepository.findOne({
      where: { id },
      relations: {
        translations: true,
      },
    });

    if (!staticPage) {
      throw new NotFoundException('Page not found');
    }

    return staticPage;
  }

  async getStaticPages({
    page = PAGINATION_DEFAULT_SETTINGS.page,
    limit = PAGINATION_DEFAULT_SETTINGS.limit,
    order = SortOrderEnum.ASC,
  }: GetAllStaticPagesFiltersDto): Promise<GetAllStaticPagesResponseDto> {
    const staticPageQueryBuilder: SelectQueryBuilder<StaticPage> =
      await this.getStaticPagesQueryBuilder([
        'id',
        'title',
        'slug',
        'content',
        'createdAt',
        'updatedAt',
        'noIndex',
      ]);

    staticPageQueryBuilder.orderBy('created_at', order);

    const paginator: Pagination<StaticPage> = await paginate<StaticPage>(
      staticPageQueryBuilder,
      {
        page,
        limit,
      },
    );

    return new Pagination<StaticPage>(paginator.items, paginator.meta);
  }

  async create(staticPageDto: CreateStaticPageDto): Promise<StaticPage> {
    const existingStaticPage = await this.staticPageRepository.findOne({
      where: [{ slug: staticPageDto.slug }, { title: staticPageDto.title }],
    });
    //uncomment if slug should be generated automatically and npm i slugify
    //import slugify from 'slugify';
    //const slug = await this.getSlug(title);
    if (existingStaticPage) {
      throw new BadRequestException(
        'Static page with this slug or title already exists',
      );
    }
    const staticPage = new this.staticPage();
    const translations: StaticPageLang[] = [];
    for (const item of staticPageDto.translations) {
      const staticPageLang = new this.staticPageLang();
      Object.assign<StaticPageLang, Partial<StaticPageLang>>(
        staticPageLang,
        item,
      );
      translations.push(staticPageLang);
    }
    staticPage.slug = staticPageDto.slug;
    staticPage.title = staticPageDto.title;
    staticPage.content = staticPageDto.content;
    staticPage.noIndex = staticPageDto.noIndex;
    staticPage.translations = translations;
    return this.staticPageRepository.save(staticPage);
  }

  // private async getSlug(title: string) {
  //   const slugBase = slugify(title, { lower: true });
  //   let slug = slugBase;
  //   let slugCount = 1;
  //   while (await this.slugExists(slug, title)) {
  //     slug = `${slugBase}-${slugCount}`;
  //     slugCount++;
  //   }
  //   return slug;
  // }
  // private async slugExists(slug: string, title: string): Promise<boolean> {
  //   const existingRaffle = await this.staticPageRepository.findOne({
  //     where: { slug, id: Not(title) },
  //   });
  //   return !!existingRaffle;
  // }

  async update(
    id: number,
    updateStaticPageDto: UpdateStaticPageDto,
  ): Promise<UpdateStaticPageDto> {
    const staticPage = await this.staticPageRepository.findOne({
      where: { id },
    });
    // uncomment if slug should be generated automatically and npm i slugify
    // import slugify from 'slugify';
    // const slug = await this.getSlug(title);
    if (!staticPage) {
      throw new NotFoundException('Page not found');
    }
    const existingStaticPage = await this.staticPageRepository.findOne({
      where: [
        { slug: updateStaticPageDto.slug, id: Not(id) },
        { title: updateStaticPageDto.title, id: Not['id'] },
      ],
    });
    if (existingStaticPage) {
      throw new BadRequestException(
        'Static page with this slug or title already exists',
      );
    }

    const translations: StaticPageLang[] = [];
    for (const item of updateStaticPageDto.translations) {
      const staticPageLang = new this.staticPageLang();
      Object.assign<StaticPageLang, Partial<StaticPageLang>>(
        staticPageLang,
        item,
      );
      translations.push(staticPageLang);
    }
    staticPage.slug = updateStaticPageDto.slug;
    staticPage.title = updateStaticPageDto.title;
    staticPage.content = updateStaticPageDto.content;
    staticPage.noIndex = updateStaticPageDto.noIndex;
    staticPage.translations = translations;
    return await this.staticPageRepository.save(staticPage);
  }

  async delete(id: number) {
    const staticPage = await this.staticPageRepository.findOne({
      where: { id },
    });
    if (!staticPage) {
      throw new NotFoundException('Page not found');
    }
    await this.staticPageRepository.delete({ id });
    return {
      success: true,
    };
  }

  async getStaticPagesQueryBuilder(selectedFields: (keyof StaticPage)[]) {
    const staticPagesSelectedFields = selectedFields.map(
      (field) => `static-page.${field}`,
    );
    const queryBuilder: SelectQueryBuilder<StaticPage> =
      this.staticPageRepository
        .createQueryBuilder('static-page')
        .select(staticPagesSelectedFields);
    return queryBuilder;
  }
}
