import { Sections } from './Entities/sections.entity';
import { DataSource } from 'typeorm';
import { Module, Global } from '@nestjs/common';
import { Users } from './Entities/users.entity';
import { DatabaseModule } from 'src/Database/database.module';
import { Boards } from './Entities/boards.entity';
import { Tasks } from './Entities/tasks.entity';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'USERS',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Users),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'BOARDS',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Boards),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SECTIONS',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Sections),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'TASKS',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Tasks),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: ['USERS', 'BOARDS', 'SECTIONS', 'TASKS'],
})
export class EntityModule {}
