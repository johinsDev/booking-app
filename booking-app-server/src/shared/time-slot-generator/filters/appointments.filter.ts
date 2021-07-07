import { DateTime } from 'luxon';
import Appointment from 'src/appointments/entities/appointment.entity';
import { TimeSlotGenerator } from '../time-slot-generator';
import { Filter } from './filter';

export default class AppointmentsFilter implements Filter {
  constructor(public appointments: Appointment[]) {}

  apply(generator: TimeSlotGenerator, slot: DateTime) {
    for (const appointment of this.appointments) {
      const startTime = DateTime.fromSQL(
        `${appointment.date} ${appointment.startTime}`,
      ).minus({
        minutes: generator.service.duration - generator.INCREMENT,
      });

      const endTime = DateTime.fromSQL(
        `${appointment.date} ${appointment.endTime}`,
      ).minus({
        minutes: generator.INCREMENT,
      });

      if (slot >= startTime && slot <= endTime) {
        return false;
      }
    }

    return true;
  }
}
