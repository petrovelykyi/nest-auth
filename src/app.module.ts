import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      useUnifiedTopology: true,
      type: 'mongodb',
      host: '0.0.0.0',
      database: 'test',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
  ],
  // controllers: [UsersController],
  providers: [],
})
export class AppModule {}
