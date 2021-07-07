import { Employee } from 'src/employee/entities/employee.entity';
import ScheduleUnAvailabilities from 'src/schedule_unavailabilities/entities/schedule_unavailabilities.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.schedules, {
    primary: true,
  })
  employee: Employee;

  @OneToMany(
    () => ScheduleUnAvailabilities,
    (scheduleUnAvailabilities) => scheduleUnAvailabilities.schedule,
    {
      primary: true,
    },
  )
  unAvailabilities: ScheduleUnAvailabilities[];

  @Column({
    type: 'bigint',
  })
  employeeId: number;

  @Column({
    type: 'date',
  })
  date: Date;

  @Column({
    type: 'time',
  })
  startTime: Date;

  @Column({
    type: 'time',
  })
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
