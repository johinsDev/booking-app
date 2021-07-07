import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateTime } from 'luxon';

@ValidatorConstraint({ name: 'isValidDAte' })
export class IsValidDateRule implements ValidatorConstraintInterface {
  validate(value: string | DateTime): boolean {
    return DateTime.fromISO(
      typeof value === 'string' ? value : value.toISODate(),
    ).isValid;
  }

  defaultMessage(args: ValidationArguments): string {
    return `"${args.property}" is not valid date`;
  }
}

export function IsValidDate(
  args?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [args],
      validator: IsValidDateRule,
    });
  };
}
