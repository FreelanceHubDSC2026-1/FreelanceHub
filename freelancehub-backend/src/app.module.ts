import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalEntity } from './modules/proposals/entities/proposal.entity';
import { ProposalsModule } from './modules/proposals/proposals.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    ProposalsModule,
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: Number(configService.get<string>('DB_PORT')),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [ProposalEntity],
      synchronize: true,
    }),
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }