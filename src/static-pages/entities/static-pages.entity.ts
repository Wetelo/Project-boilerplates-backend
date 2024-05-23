import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StaticPageLang } from './static-pages-lang.entity';

@Entity()
export class StaticPage {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty()
  @Column({ unique: true })
  public slug: string;

  @ApiProperty()
  @Column({ unique: true })
  public title: string;

  @ApiProperty()
  @Column({ nullable: true })
  public content: string;

  @ApiProperty()
  @Column({
    name: 'no_index',
    default: false,
  })
  public noIndex: boolean;

  @ApiProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @OneToMany(() => StaticPageLang, (staticPageLang) => staticPageLang.page, {
    cascade: ['insert', 'update'],
  })
  translations: StaticPageLang[];
}
