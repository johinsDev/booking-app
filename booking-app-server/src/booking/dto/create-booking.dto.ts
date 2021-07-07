import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Exists } from 'src/shared/rules/exists.rule';
import { IsAfterDate } from 'src/shared/rules/is-after-date.rule';
import { IsValidDate } from 'src/shared/rules/is-valid-date.rule';

export class CreateBookingDto {
  @IsPositive()
  @Exists('service:id')
  @Transform(({ value }) => Number(value))
  serviceId: number;

  @IsPositive()
  @Exists('employee:id')
  @Transform(({ value }) => Number(value))
  employeeId: number;

  @IsAfterDate()
  @IsValidDate()
  date: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;
}
