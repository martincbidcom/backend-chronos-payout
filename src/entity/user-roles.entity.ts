import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user_roles' })
export class UserRolesEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  role: string;

  @Column()
  user_id: number;
}
