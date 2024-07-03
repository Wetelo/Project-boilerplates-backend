import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_invitation' })
export class UserInvitation {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    name: 'expired_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public expiredAt: Date;

  @Column({ unique: true })
  email: string;
}
