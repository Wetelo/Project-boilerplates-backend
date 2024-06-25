import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaTag } from '../../meta-tags/entities/meta-tag.entity';
import {
  Between,
  FindOptionsWhere,
  ILike,
  Not,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { ENTITIES } from '../../common/enums/entities';
import { MetaTagType } from '../../meta-tags/types/meta-tag.type';
import { CreateMetaTagDto } from '../dto/meta-tag/create-meta-tag.dto';
import { FileEntity } from '../../file/entities/file.entity';
import { UpdateMetaTagDto } from '../dto/meta-tag/update-meta-tag.dto';
import { PAGINATION_DEFAULT_SETTINGS } from '../../common/constants/pagination';
import { SortOrderEnum } from '../../common/enums/sort-order.enum';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { MetaTagFilterDto } from '../dto/meta-tag/meta-tag-filter.dto';
import { MetaTagSortByEnum } from '../enum/meta-tag-sort-by.enum';
import {
  AdminGetAllMetaTagsResponseDto,
  AdminMetaTagItemDto,
} from '../dto/responses/meta-tag/admin-get-all-meta-tags-response.dto';

@Injectable()
export class AdminMetaTagService {
  constructor(
    @InjectRepository(MetaTag)
    private readonly metaTagRepository: Repository<MetaTag>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @Inject(ENTITIES.META_TAG)
    private readonly metaTagType: MetaTagType,
  ) {}

  async create(createDto: CreateMetaTagDto) {
    const existingMetaTag = await this.metaTagRepository.findOne({
      where: [{ slug: createDto.slug }, { title: createDto.title }],
    });
    //uncomment if slug should be generated automatically and npm i slugify
    //import slugify from 'slugify';
    //const slug = await this.getSlug(title);
    if (existingMetaTag) {
      throw new BadRequestException(
        'Meta tag with this slug or title already exists',
      );
    }

    const metaTag = new this.metaTagType();
    metaTag.slug = createDto.slug;
    metaTag.title = createDto.title;
    metaTag.description = createDto.description;
    metaTag.keywords = createDto.keywords;
    if (createDto.imageId) {
      const image = await this.fileRepository.findOne({
        where: {
          id: createDto.imageId,
        },
      });
      metaTag.image = image ?? null;
    }
    return this.metaTagRepository.save(metaTag);
  }

  async update(id: number, updateDto: UpdateMetaTagDto) {
    const metaTag = await this.metaTagRepository.findOne({
      where: { id },
      relations: {
        image: true,
      },
    });
    // uncomment if slug should be generated automatically and npm i slugify
    // import slugify from 'slugify';
    // const slug = await this.getSlug(title);
    if (!metaTag) {
      throw new NotFoundException('Meta tag not found');
    }
    const existingMetaTag = await this.metaTagRepository.findOne({
      where: [
        { slug: updateDto.slug, id: Not(id) },
        { title: updateDto.title, id: Not['id'] },
      ],
    });
    if (existingMetaTag) {
      throw new BadRequestException(
        'Meta tag with this slug or title already exists',
      );
    }

    metaTag.slug = updateDto.slug;
    metaTag.title = updateDto.title;
    metaTag.description = updateDto.description;
    metaTag.keywords = updateDto.keywords;
    if (updateDto.imageId) {
      const image = await this.fileRepository.findOne({
        where: { id: updateDto.imageId },
      });
      metaTag.image = image ?? null;
    } else {
      metaTag.image = null;
    }

    return await this.metaTagRepository.save(metaTag);
  }

  async delete(id: number) {
    const metaTag = await this.metaTagRepository.findOne({
      where: { id },
      relations: {
        image: true,
      },
    });
    if (!metaTag) {
      throw new NotFoundException('Meta tag not found');
    }
    await this.metaTagRepository.delete({ id });
    return {
      success: true,
    };
  }

  async getAll({
    page = PAGINATION_DEFAULT_SETTINGS.page,
    limit = PAGINATION_DEFAULT_SETTINGS.limit,
    sortBy,
    order = SortOrderEnum.ASC,
    ...findFields
  }: MetaTagFilterDto): Promise<AdminGetAllMetaTagsResponseDto> {
    const metaQueryBuilder: SelectQueryBuilder<MetaTag> = this.metaTagRepository
      .createQueryBuilder('meta_tag')
      .select([
        'meta_tag.id',
        'meta_tag.title',
        'meta_tag.slug',
        'meta_tag.description',
        'meta_tag.createdAt',
      ])
      .orderBy(
        sortBy ? MetaTagSortByEnum[sortBy] : MetaTagSortByEnum['createdAt'],
        order,
      );
    const whereConditions: FindOptionsWhere<MetaTag> = {};
    if (findFields.createdAt) {
      const dateFrom = new Date(findFields.createdAt);
      dateFrom.setHours(0);
      const dateTo = new Date(dateFrom);
      dateTo.setDate(dateFrom.getDate() + 1);
      whereConditions.createdAt = Between(dateFrom, dateTo);
    }
    if (findFields.id) {
      whereConditions.id = findFields.id;
    }

    if (findFields.slug) {
      whereConditions.slug = ILike(`%${findFields.slug}%`);
    }

    if (findFields.title) {
      whereConditions.title = ILike(`%${findFields.title}%`);
    }

    if (findFields.description) {
      whereConditions.description = ILike(`%${findFields.description}%`);
    }

    metaQueryBuilder.where({ ...whereConditions });
    const paginator: Pagination<MetaTag> = await paginate<MetaTag>(
      metaQueryBuilder,
      {
        page,
        limit,
      },
    );
    return new Pagination<AdminMetaTagItemDto>(paginator.items, paginator.meta);
  }

  async getOne(id: number) {
    const metaTag = await this.metaTagRepository.findOne({
      where: { id },
      relations: {
        image: true,
      },
    });

    if (!metaTag) {
      throw new NotFoundException('Meta Tag not found');
    }

    return metaTag;
  }
}
