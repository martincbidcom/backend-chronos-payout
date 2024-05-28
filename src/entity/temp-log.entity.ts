import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('temp_log')
export class TempLog {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: false })
  process: string;

  @Column({ nullable: false })
  method: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true
  })
  createdAt?: Date;

}
