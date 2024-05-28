import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'bind_cvu_accounts_transactions' })
export class BindCvuAccountsTransactionsEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  transaction_id_1: string;
}
