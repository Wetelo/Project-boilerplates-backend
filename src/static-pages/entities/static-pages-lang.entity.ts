import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StaticPage } from './static-pages.entity';
import { LangEnum } from '../../common/enums/lang.enum';

@Entity()
export class StaticPageLang {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'lang_id', enum: LangEnum })
  langId: LangEnum;

  @JoinColumn({ name: 'page_id', referencedColumnName: 'id' })
  @ManyToOne(() => StaticPage)
  public page: StaticPage;

  @Column({ nullable: true })
  public content: string;

  @Column()
  public title: string;
}
