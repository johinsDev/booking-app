import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Appointment from 'src/appointments/entities/appointment.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Service } from 'src/service/entities/service.entity';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';

@Module({
  imports: [
    ConfigService,
    TypeOrmModule.forFeature([Appointment, Employee, Schedule, Service]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, ConfigService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
