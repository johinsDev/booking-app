import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Service } from 'src/service/entities/service.entity';
import { Filter } from './filters/filter';

export class TimeSlotGenerator {
  private _interval: DateTime[];

  public readonly INCREMENT = 15;

  constructor(
    public schedule: Schedule,
    public service: Service,
    private config: ConfigService,
  ) {
    let now = DateTime.fromSQL(
      `${this.schedule.date} ${this.schedule.startTime}`,
    );

    const later = DateTime.fromSQL(
      `${this.schedule.date} ${this.schedule.endTime}`,
    ).minus({
      minutes: service.duration,
    });

    this._interval = [now];

    while (now < later) {
      now = now.plus({
        minutes: this.INCREMENT,
      });

      this._interval.push(now);
    }
  }

  get interval() {
    console.log(this._interval.map((s) => s.toString()));

    return this._interval.map((s) => s.setZone(this.config.get('TIME_ZONE')));
  }

  applyFilters(filters: Filter[]): TimeSlotGenerator {
    this._interval = this._interval.filter((slot) => {
      for (const filter of filters) {
        const filterResult = filter.apply(this, slot, this._interval);

        if (!filterResult) {
          return false;
        }
      }

      return true;
    });

    return this;
  }
}
