import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Users } from 'src/Entity/Entities/users.entity';
import { Boards } from 'src/Entity/Entities/boards.entity';
import { Sections } from 'src/Entity/Entities/sections.entity';
import { Tasks } from 'src/Entity/Entities/tasks.entity';
dotenv.config();

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT as any as number,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [Users, Boards, Sections, Tasks],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
