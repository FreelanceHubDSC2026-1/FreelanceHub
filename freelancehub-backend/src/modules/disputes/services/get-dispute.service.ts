import { Injectable, Inject } from '@nestjs/common';
import { DisputesRepository } from './open-dispute.service';
import { Dispute } from '../entities/dispute.entity';
import { DisputeNotFoundException } from '../../../common/exceptions/dispute-not-found.exception';

@Injectable()
export class GetDisputeService {
  constructor(
    @Inject('DISPUTES_REPOSITORY')
    private readonly disputesRepository: DisputesRepository,
  ) {}

  async execute(id: string): Promise<Dispute> {
    const dispute = await this.disputesRepository.findById(id);
    if (!dispute) {
      throw new DisputeNotFoundException();
    }
    return dispute;
  }
}
