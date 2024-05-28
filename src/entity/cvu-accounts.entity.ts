import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cvu_accounts' })
export class CvuAccountsEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  user_id: number;
  @Column()
  cvu_account_id: number
}
