import { DateTime } from 'luxon';
import ScheduleUnAvailabilities from 'src/schedule_unavailabilities/entities/schedule_unavailabilities.entity';
import { TimeSlotGenerator } from '../time-slot-generator';
import { Filter } from './filter';

export default class UnAvailabilitiesFilter implements Filter {
  constructor(public unAvailabilities: ScheduleUnAvailabilities[]) {}

  apply(generator: TimeSlotGenerator, slot: DateTime) {
    for (const unAvailability of this.unAvailabilities) {
      const startTime = DateTime.fromSQL(
        unAvailability.startTime.toString(),
      ).minus({
        minutes: generator.service.duration - generator.INCREMENT,
      });

      const endTime = DateTime.fromSQL(unAvailability.endTime.toString()).minus(
        {
          minutes: generator.INCREMENT,
        },
      );

      if (slot >= startTime && slot <= endTime) {
        return false;
      }
    }

    return true;
  }
}
