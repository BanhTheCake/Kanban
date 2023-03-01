import { BoardModule } from './Board/board.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './Auth/auth.module';
import { DatabaseModule } from './Database/database.module';
import { EntityModule } from './Entity/Entity.module';
import { SectionModule } from './Section/section.module';
import { TaskModule } from './Task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EntityModule,
    AuthModule,
    BoardModule,
    SectionModule,
    TaskModule,
  ],
})
export class AppModule {}
