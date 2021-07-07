import { Schedule } from 'src/schedule/entities/schedule.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class ScheduleUnAvailabilities extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'time',
  })
  startTime: Date;

  @Column({
    type: 'time',
  })
  endTime: Date;

  @ManyToOne(() => Schedule, (schedule) => schedule.unAvailabilities, {
    primary: true,
  })
  schedule: Schedule;

  @Column()
  scheduleId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
