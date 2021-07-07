import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getConnection } from 'typeorm';

@ValidatorConstraint({ name: 'exists', async: true })
@Injectable()
export class ExistsRule implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const tableName = args.constraints[0];

    const fieldName = args.constraints[1] || args.property;

    const fieldValue = value;

    const connectionName = args.constraints[2] || 'default';

    const data = await getConnection(connectionName)
      .createQueryBuilder()
      .select(fieldName)
      .from(tableName, tableName)
      .where(`${tableName}.${fieldName} = :fieldValue`, { fieldValue })
      .limit(1)
      .execute();

    return !!data?.[0]?.[fieldName];
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} ${args.value} does not exist.`;
  }
}

export function Exists(args: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: args.split(':'),
      validator: ExistsRule,
    });
  };
}
