import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

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

  @OneToOne(() => User, (user) => user.avatar, {
    cascade: ['insert', 'update'],
  })
  user: User;
}
