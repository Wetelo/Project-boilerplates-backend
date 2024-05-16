import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StaticPage } from './static-pages.entity';

@Entity()
export class StaticPageLang {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'lang_id' })
  langId: string;

  @JoinColumn({ name: 'page_id', referencedColumnName: 'id' })
  @ManyToOne(() => StaticPage)
  public page: StaticPage;

  @Column({ nullable: true })
  public content: string;

  @ApiProperty()
  @Column()
  public title: string;
}
