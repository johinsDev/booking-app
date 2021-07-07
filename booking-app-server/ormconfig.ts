import EnvironmentVariables from 'src/config/configuration';
import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
const {
  DATABASE: { CONNECTION, HOST, PORT, USERNAME, PASSWORD, DATABASE },
} = EnvironmentVariables();

const config: ConnectionOptions = {
  type: CONNECTION as any,
  host: HOST,
  port: PORT,
  username: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  synchronize: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrations: ['src/database/migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};
export default config;
