import "dotenv/config";
import "reflect-metadata";
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [__dirname + '/models/*.{ts,js}'],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
