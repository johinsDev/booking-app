import { Employee } from 'src/employee/entities/employee.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from './service.entity';

@Entity()
export class EmployeeService extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.employeeServices, {
    primary: true,
  })
  employee: Employee;

  @ManyToOne(() => Service, (service) => service.employeeServices, {
    primary: true,
  })
  service: Service;

  @Column({
    type: 'bigint',
  })
  serviceId: number;

  @Column({
    type: 'bigint',
  })
  employeeId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
