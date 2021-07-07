import { DateTime } from 'luxon';
import { TimeSlotGenerator } from '../time-slot-generator';
import { Filter } from './filter';

export default class SlotsPassedTodayFilter implements Filter {
  apply(generator: TimeSlotGenerator, slot: DateTime) {
    const now = DateTime.local();

    const dateSchedule = DateTime.fromSQL(generator.schedule.date.toString());

    if (dateSchedule.hasSame(now, 'day')) {
      if (slot < now) {
        return false;
      }
    }

    return true;
  }
}
