import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'stellar_accounts' })
export class StellarAccountEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  stellar_account_id: number;
}
