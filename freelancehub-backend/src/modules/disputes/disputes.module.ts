import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispute } from './entities/dispute.entity';
import { DisputesTypeOrmRepository } from './repositories/disputes.typeorm.repository';
import { DisputesService, DISPUTES_REPOSITORY } from './services/disputes.service';
import { OpenDisputeService } from './services/open-dispute.service';
import { DisputesController } from './controllers/disputes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dispute]),
  ],
  controllers: [
    DisputesController,
  ],
  providers: [
    DisputesService,
    OpenDisputeService,
    {
      provide: DISPUTES_REPOSITORY,
      useClass: DisputesTypeOrmRepository,
    },
  ],
  exports: [
    DISPUTES_REPOSITORY,
    DisputesService,
    OpenDisputeService,
  ],
})
export class DisputesModule {}
