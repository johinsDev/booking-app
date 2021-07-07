import { Employee } from 'src/employee/entities/employee.entity';
import { Service } from 'src/service/entities/service.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Generated('uuid')
  @Column({
    type: 'uuid',
  })
  uuid: string;

  @Column()
  token: string;

  @Column({
    type: 'date',
  })
  date: string;

  @Column({
    type: 'time',
  })
  startTime: string;

  @Column({
    type: 'time',
  })
  endTime: string;

  @ManyToOne(() => Service, (service) => service.appointments, {
    primary: true,
  })
  service: Service;

  @ManyToOne(() => Employee, (employee) => employee.appointments, {
    primary: true,
  })
  employee: Employee;

  @Column()
  employeeId: number;

  @Column()
  serviceId: number;

  @Column()
  clientEmail: string;

  @Column()
  clientName: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  cancelledAt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
