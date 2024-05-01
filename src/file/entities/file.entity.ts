import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true, name: 'file_name' })
  public fileName: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;
}
