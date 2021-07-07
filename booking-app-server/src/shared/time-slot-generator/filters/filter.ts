import { DateTime } from 'luxon';
import { TimeSlotGenerator } from '../time-slot-generator';

export interface Filter {
  apply(
    generator: TimeSlotGenerator,
    slot: DateTime,
    interval: DateTime[],
  ): boolean;
}
