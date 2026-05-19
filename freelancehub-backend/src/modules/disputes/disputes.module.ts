import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisputeEntity } from './entities/dispute.entity';
import { ProjectEntity } from './entities/project.entity';
import { DisputesTypeOrmRepository } from './repositories/disputes.typeorm.repository';
import { ProjectsTypeOrmRepository } from './repositories/projects.typeorm.repository';
import { DISPUTES_REPOSITORY } from './repositories/disputes.repository.interface';
import { PROJECTS_REPOSITORY } from './repositories/projects.repository.interface';
import { EVENT_EMITTER, PAYMENT_SERVICE, ConsoleEventEmitter, ConsolePaymentService } from './services/infrastructure-mocks';
import { DisputesService } from './services/disputes.service';
import { DisputesController } from './controllers/disputes.controller';
import { DisputesQueryController } from './controllers/disputes-query.controller';
import { GetDisputeService } from './services/get-dispute.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DisputeEntity, ProjectEntity]),
  ],
  controllers: [
    DisputesController,
    DisputesQueryController,
  ],
  providers: [
    DisputesService,
    GetDisputeService,
    {
      provide: DISPUTES_REPOSITORY,
      useClass: DisputesTypeOrmRepository,
    },
    {
      provide: PROJECTS_REPOSITORY,
      useClass: ProjectsTypeOrmRepository,
    },
    {
      provide: EVENT_EMITTER,
      useClass: ConsoleEventEmitter,
    },
    {
      provide: PAYMENT_SERVICE,
      useClass: ConsolePaymentService,
    },
  ],
  exports: [
    DISPUTES_REPOSITORY,
    PROJECTS_REPOSITORY,
    DisputesService,
    GetDisputeService,
  ],
})
export class DisputesModule {}
