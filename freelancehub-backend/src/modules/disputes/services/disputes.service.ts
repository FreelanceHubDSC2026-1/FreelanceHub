import { Injectable, Inject } from '@nestjs/common';
import { Dispute } from '../entities/dispute.entity';
import { ProjectAlreadyCompletedException } from '../../../common/exceptions/project-already-completed.exception';
import { DisputeAlreadyExistsException } from '../../../common/exceptions/dispute-already-exists.exception';

export const DISPUTES_REPOSITORY = 'DISPUTES_REPOSITORY';
export const PROJECTS_REPOSITORY = 'PROJECTS_REPOSITORY';

export interface CreateDisputeDto {
  projectId: string;
  reason: string;
}

@Injectable()
export class DisputesService {
  constructor(
    @Inject('DISPUTES_REPOSITORY')
    private readonly disputesRepository: any,
    @Inject('PROJECTS_REPOSITORY')
    private readonly projectsRepository: any,
  ) {}

  async createDispute(dto: CreateDisputeDto): Promise<Dispute> {
    const project = await this.projectsRepository.findById(dto.projectId);
    
    if (project && project.status === 'COMPLETED') {
      throw new ProjectAlreadyCompletedException();
    }

    const existingDispute = await this.disputesRepository.findByProjectId(dto.projectId);
    if (existingDispute) {
      throw new DisputeAlreadyExistsException();
    }

    const dispute = Dispute.create(dto.projectId, dto.reason);

    return this.disputesRepository.save(dispute);
  }
}
