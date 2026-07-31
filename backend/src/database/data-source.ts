import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';

// 加载环境变量
config({
  path: process.env.NODE_ENV === 'production'
    ? path.resolve('.env.production')
    : path.resolve('.env'),
});

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/modules/**/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: false,
  timezone: '+08:00',
});
