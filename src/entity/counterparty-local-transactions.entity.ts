import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'counterparty_local_transactions' })
export class CounterpartyLocalTransactionsEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  chronos_target_local_transactions_id: number;
}
