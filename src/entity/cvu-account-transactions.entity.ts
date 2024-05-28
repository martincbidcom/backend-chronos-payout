import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cvu_account_transactions' })
export class CvuAccountTransactionsEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  cvu_account_transaction_id: number;

  @Column()
  bind_transaction_id: string;
}
