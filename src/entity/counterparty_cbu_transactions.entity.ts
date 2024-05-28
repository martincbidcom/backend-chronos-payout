import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity({ name: 'counterparty_cbu_transactions' })
  export class CounterpartyCbuTransactionsEntity {
    @PrimaryGeneratedColumn()
    id?: string;
  
    @Column()
    counterparty_cbu_transaction_id: number;
  }
  