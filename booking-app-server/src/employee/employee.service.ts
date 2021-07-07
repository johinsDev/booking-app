import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import Appointment from 'src/appointments/entities/appointment.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Service } from 'src/service/entities/service.entity';
import AppointmentsFilter from 'src/shared/time-slot-generator/filters/appointments.filter';
import IsAfterOrEqualFilter from 'src/shared/time-slot-generator/filters/is-after-or-equal';
import SlotsPassedTodayFilter from 'src/shared/time-slot-generator/filters/stots-passed-today.filter';
import UnAvailabilitiesFilter from 'src/shared/time-slot-generator/filters/un-availabilities.filter';
import { TimeSlotGenerator } from 'src/shared/time-slot-generator/time-slot-generator';
import { IsNull, Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  appointmentForDate(date: string, employeeId: number) {
    return this.appointmentRepository.find({
      date,
      employeeId,
      cancelledAt: IsNull(),
    });
  }

  async findOneOrFailById(id: number) {
    const employee = await this.employeeRepository.findOne(id, {
      relations: ['employeeServices'],
    });

    if (!employee) {
      throw new NotFoundException(
        'Employee not found',
        'Employee with id: ' + id + ' not found.',
      );
    }

    return employee;
  }

  async findOneServiceOrFail(id: number) {
    const service = await this.serviceRepository.findOne(id);

    if (!service) {
      throw new NotFoundException(
        'Service not found',
        'Service with id: ' + id + ' not found.',
      );
    }

    return service;
  }

  findScheduleByDate(date: Date, employeeId: number) {
    return this.scheduleRepository.findOne({
      relations: ['unAvailabilities'],
      where: {
        date,
        employeeId,
      },
    });
  }

  async availableTimeSlot(
    schedule: Schedule,
    service: Service,
    appointments: Appointment[],
  ): Promise<DateTime[]> {
    return new TimeSlotGenerator(schedule, service, this.config).applyFilters([
      new IsAfterOrEqualFilter(),
      new SlotsPassedTodayFilter(),
      new UnAvailabilitiesFilter(schedule.unAvailabilities),
      new AppointmentsFilter(appointments),
    ]).interval;
  }
}
