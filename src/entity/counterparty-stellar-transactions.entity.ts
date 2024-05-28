import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity({ name: 'counterparty_stellar_transactions' })
  export class CounterpartyStellarTransactionsEntity {
    @PrimaryGeneratedColumn()
    id?: string;
  
    @Column()
    chronos_target_local_transactions_id: number;
  }
  