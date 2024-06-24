import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetaTag } from '../entities/meta-tag.entity';
import { MetaTagAllResponseDto } from '../dto/meta-tag-all-response.dto';
import { MetaTagResponseDto } from '../dto/meta-tag-response.dto';

@Injectable()
export class MetaTagService {
  constructor(
    @InjectRepository(MetaTag)
    private readonly metaTagRepository: Repository<MetaTag>,
  ) {}
  async getAll(): Promise<MetaTagAllResponseDto> {
    const items = await this.metaTagRepository.find({
      relations: { image: true },
    });
    return {
      items: items.map((item) => {
        return {
          id: item.id,
          slug: item.slug,
          title: item.title,
          description: item.description,
          keywords: item.keywords,
          imageUrl: this.getImageBaseUrl() + item.image.fileName,
        };
      }),
    };
  }

  getImageBaseUrl() {
    //implement if need
    return '';
  }
  async getOneBySlug(slug: string): Promise<MetaTagResponseDto> {
    const item = await this.metaTagRepository.findOne({
      where: { slug },
      relations: { image: true },
    });
    if (!slug) {
      throw new NotFoundException('This slug doesn`t exist');
    }
    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      keywords: item.keywords,
      imageUrl: this.getImageBaseUrl() + item.image.fileName,
    };
  }
}
