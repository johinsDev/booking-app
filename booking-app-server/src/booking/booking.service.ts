import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import Appointment from 'src/appointments/entities/appointment.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Service } from 'src/service/entities/service.entity';
import { Connection, IsNull, Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly config: ConfigService,
    private readonly employeeService: EmployeeService,
    @InjectConnection()
    private readonly connection: Connection,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const { serviceId, email, name, date, employeeId } = createBookingDto;

    const formatDate = DateTime.fromISO(date, {
      zone: this.config.get('TIME_ZONE'),
    });

    const [service, employee, schedule, appointments] = await Promise.all([
      this.serviceRepository.findOneOrFail(serviceId),
      this.employeeRepository.findOneOrFail(employeeId, {
        relations: ['employeeServices'],
      }),
      this.scheduleRepository.findOneOrFail({
        relations: ['unAvailabilities'],
        where: {
          date,
          employeeId,
        },
      }),
      this.appointmentRepository.find({
        date,
        employeeId,
        cancelledAt: IsNull(),
      }),
    ]);

    if (
      !employee.employeeServices.some(
        (employeeService) => employeeService.serviceId === service.id,
      )
    ) {
      throw new BadRequestException(
        'Este servicio no esta disponible para el empleado.',
      );
    }

    const slots = await this.employeeService.availableTimeSlot(
      schedule,
      service,
      appointments,
    );

    if (!slots.find((s) => s.equals(formatDate))) {
      throw new BadRequestException(
        'Este servicio no esta disponible en esta hora.',
      );
    }

    const appointment = new Appointment();

    appointment.clientEmail = email;

    appointment.clientName = name;

    appointment.employeeId = employeeId;

    appointment.serviceId = employeeId;

    appointment.serviceId = employeeId;

    appointment.date = formatDate.toUTC().toSQL();

    appointment.startTime = formatDate.toUTC().toSQLTime();

    appointment.endTime = formatDate
      .toUTC()
      .plus({
        minutes: service.duration,
      })
      .toSQLTime();

    return this.appointmentRepository.save(appointment);
  }

  async findOne(uuid: string, token: string) {
    const appointment = await this.appointmentRepository.findOne({
      relations: ['service', 'employee'],
      cache: {
        milliseconds: 1000 * 30,
        id: `APPOINTMENT_${uuid}`,
      },
      where: {
        uuid,
        token,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    return appointment;
  }

  async cancel(uuid: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        uuid,
      },
    });

    this.appointmentRepository.clear;

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    appointment.cancelledAt = DateTime.now().toSQL();

    this.connection.queryResultCache.clear();

    return this.appointmentRepository.save(appointment);
  }
}
