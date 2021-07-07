import { DateTime } from 'luxon';
import { TimeSlotGenerator } from '../time-slot-generator';
import { Filter } from './filter';

export default class IsAfterOrEqualFilter implements Filter {
  apply(generator: TimeSlotGenerator, slot: DateTime) {
    const now = DateTime.local();

    const dateSchedule = DateTime.fromSQL(generator.schedule.date.toString());

    const diff = now.diff(dateSchedule.endOf('day'), 'days').toObject();

    if (diff.days! > 0) {
      return false;
    }

    return true;
  }
}
