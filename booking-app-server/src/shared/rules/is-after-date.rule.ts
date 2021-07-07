import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DateTime } from 'luxon';

@ValidatorConstraint({ name: 'isAfterRule' })
export class IsAfterDateRule implements ValidatorConstraintInterface {
  validate(value: string | DateTime, args: ValidationArguments): boolean {
    const date = (args.constraints[0] ||
      DateTime.now().toFormat('yyyy-LL-dd')) as string;

    return (
      DateTime.fromISO(typeof value === 'string' ? value : value.toISODate()) >=
      DateTime.fromSQL(date)
    );
  }

  defaultMessage(args: ValidationArguments): string {
    return `"${args.property}" must be after "${args.constraints[0]}"`;
  }
}

export function IsAfterDate(
  args?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [args],
      validator: IsAfterDateRule,
    });
  };
}
