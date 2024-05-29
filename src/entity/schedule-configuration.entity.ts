import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'schedule-configuration' })
export class ScheduleConfigurationEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  nameCron: string;

  @Column()
  nameFunction: string;

  @Column()
  status: boolean
}
