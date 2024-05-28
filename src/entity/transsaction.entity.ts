import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transacction {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column('decimal', { precision: 20, scale: 10, default: 0 })
  amountFiat: number;

  @Column({nullable: true})
  referenceId: string;

  @Column({nullable: true})
  status: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  constructor(partial: Partial<Transacction>) {
    Object.assign(this, partial);
  }
}
