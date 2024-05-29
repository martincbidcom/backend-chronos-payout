import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'transactions' })
export class Transacctions {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  transaction_id?: string;

  @Column('decimal', { precision: 20, scale: 10, default: 0 })
  amountFiat: number;

  @Column({ nullable: true })
  referenceId: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  idCoelsa?: string;

  @Column({ nullable: true })
  cvuDestination: string;

  @Column({ nullable: true })
  responseBind?: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt?: Date;

  @Column({ default: 'cvu' })
  account_transaction_type?: string;
}
