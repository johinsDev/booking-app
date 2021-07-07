import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Appointment from 'src/appointments/entities/appointment.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Service } from 'src/service/entities/service.entity';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [
    ConfigService,
    TypeOrmModule.forFeature([Appointment, Service, Employee, Schedule]),
  ],
  controllers: [BookingController],
  providers: [BookingService, ConfigService, EmployeeService, ConfigService],
})
export class BookingModule {}
