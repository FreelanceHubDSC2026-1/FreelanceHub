import { Injectable, Inject } from '@nestjs/common';
import { DISPUTES_REPOSITORY, DisputesRepository } from '../repositories/disputes.repository.interface';
import { DisputeEntity } from '../entities/dispute.entity';
import { DisputeNotFoundException } from '../../../common/exceptions/dispute-not-found.exception';

@Injectable()
export class GetDisputeService {
  constructor(
    @Inject(DISPUTES_REPOSITORY)
    private readonly disputesRepository: DisputesRepository,
  ) {}

  async execute(id: string): Promise<DisputeEntity> {
    const dispute = await this.disputesRepository.findById(id);
    if (!dispute) {
      throw new DisputeNotFoundException();
    }
    return dispute;
  }
}
