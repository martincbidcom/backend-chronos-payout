import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({name: 'stellar_account_transactions'})
export class StellaAccountTransactionsEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  stellar_account_transaction_id: number;
}
