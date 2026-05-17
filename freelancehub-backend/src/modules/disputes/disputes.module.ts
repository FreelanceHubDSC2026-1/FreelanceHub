import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispute } from './entities/dispute.entity';
import { DisputesTypeOrmRepository } from './repositories/disputes.typeorm.repository';
import { DisputesService, DISPUTES_REPOSITORY } from './services/disputes.service';
import { OpenDisputeService } from './services/open-dispute.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dispute]),
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
