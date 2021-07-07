import Appointment from 'src/appointments/entities/appointment.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeService } from './employee-service.entity';

@Entity()
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'integer',
  })
  duration: number;

  @OneToMany(
    () => EmployeeService,
    (employeeService) => employeeService.employee,
  )
  employeeServices: EmployeeService[];

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
