import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { EmployeeService } from './employee.service';

// TODO Use class validation (is number positive and interger),
// date is date, is after, is valid format
// casl validation service Id is from the employee id
// abstract repository
// compose repository with criterias
// parseUid find employee
// class serializer

// test concept with querybuilder one query

interface QueryAvailableSlots {
  serviceId: string;
  date: string;
}

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get(':id/available-slots')
  async findAll(@Param('id') id: string, @Query() query: QueryAvailableSlots) {
    const date = DateTime.fromSQL(query.date);

    const [employee, service, schedule, appointments] = await Promise.all([
      this.employeeService.findOneOrFailById(+id),
      this.employeeService.findOneServiceOrFail(+query.serviceId),
      this.employeeService.findScheduleByDate(date.toJSDate(), +id),
      this.employeeService.appointmentForDate(date.toString(), +id),
    ]);

    if (!schedule) {
      return [];
    }

    if (
      !employee.employeeServices.some(
        (employeeService) => employeeService.serviceId === service.id,
      )
    ) {
      throw new BadRequestException(
        'Este servicio no esta disponible para el empleado.',
      );
    }

    return this.employeeService.availableTimeSlot(
      schedule,
      service,
      appointments,
    );
  }
}
