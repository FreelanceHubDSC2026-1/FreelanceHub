import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispute } from './entities/dispute.entity';
import { DisputesTypeOrmRepository } from './repositories/disputes.typeorm.repository';
import { DisputesService, DISPUTES_REPOSITORY } from './services/disputes.service';
import { OpenDisputeService } from './services/open-dispute.service';
import { DisputesController } from './controllers/disputes.controller';
import { DisputesQueryController } from './controllers/disputes-query.controller';
import { GetDisputeService } from './services/get-dispute.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dispute]),
  ],
  controllers: [
    DisputesController,
    DisputesQueryController,
  ],
  providers: [
    DisputesService,
    OpenDisputeService,
    GetDisputeService,
    {
      provide: DISPUTES_REPOSITORY,
      useClass: DisputesTypeOrmRepository,
    },
  ],
  exports: [
    DISPUTES_REPOSITORY,
    DisputesService,
    OpenDisputeService,
    GetDisputeService,
  ],
})
export class DisputesModule {}
