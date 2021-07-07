import Appointment from 'src/appointments/entities/appointment.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { EmployeeService } from 'src/service/entities/employee-service.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'text',
  })
  name: string;

  @OneToMany(
    () => EmployeeService,
    (employeeService) => employeeService.employee,
  )
  employeeServices: EmployeeService[];

  @OneToMany(() => Schedule, (schedule) => schedule.employee, {
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
  })
  schedules: Schedule[];

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
