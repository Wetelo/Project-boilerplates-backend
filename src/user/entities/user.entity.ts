import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { FileEntity } from '../../file/entities/file.entity';
import { Exclude } from 'class-transformer';
import { UserRefreshToken } from './user-refresh-token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true, name: 'first_name' })
  public firstName: string;

  @Column({ nullable: true, name: 'last_name' })
  public lastName: string;

  @Column({ nullable: true })
  public phone: string;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  public password: string;

  @Column({ default: true })
  public status: boolean;

  @JoinColumn({ name: 'avatar_file_id', referencedColumnName: 'id' })
  @OneToOne(() => FileEntity, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    cascade: true,
  })
  public avatar: FileEntity;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  public role: UserRoleEnum;

  @Column({
    nullable: true,
    name: 'current_hashed_refresh_token',
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  public deletedAt: Date;

  @OneToMany(
    () => UserRefreshToken,
    (refreshToken: UserRefreshToken) => refreshToken.user,
    {
      orphanedRowAction: 'delete',
      onDelete: 'CASCADE',
      cascade: ['insert', 'update'],
    },
  )
  public refreshTokens: UserRefreshToken[];
}
