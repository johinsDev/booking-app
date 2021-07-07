export default () => {
  return {
    PORT: parseInt(process.env.SERVER_PORT, 10) || 3000,
    ENVIRONMENT: process.env.NODE_ENV || 'DEVELOPMENT',
    TIME_ZONE: 'America/Bogota',
    DATABASE: {
      HOST: process.env.DB_HOST || 'database',
      PORT: parseInt(process.env.DB_PORT, 10) || 5432,
      DATABASE: process.env.DB_DATABASE,
      USERNAME: process.env.DB_USERNAME,
      PASSWORD: process.env.DB_PASSWORD,
      CONNECTION: process.env.DB_CONNECTION || 'postgres',
      DATABASE_REDIS: {
        HOST: process.env.DB_REDIS_HOST || 'redis',
        PORT: Number(process.env.DB_REDIS_PORT) || 6379,
      },
    },
  };
};
