import { Injectable, Inject } from '@nestjs/common';
import { Dispute } from '../entities/dispute.entity';
import { Project } from '../entities/project.domain';
import { DisputeAlreadyExistsException } from '../../../common/exceptions/dispute-already-exists.exception';

export const DISPUTES_REPOSITORY = 'DISPUTES_REPOSITORY';
export const PROJECTS_REPOSITORY = 'PROJECTS_REPOSITORY';

export interface CreateDisputeCommand {
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

  async createDispute(command: CreateDisputeCommand): Promise<Dispute> {
    const projectData = await this.projectsRepository.findById(command.projectId);
    
    if (projectData) {
      const project = new Project(
        projectData.id,
        projectData.clientId,
        projectData.freelancerId,
        projectData.status,
      );
      project.checkDisputeEligibility();
    }

    const existingDispute = await this.disputesRepository.findByProjectId(command.projectId);
    if (existingDispute) {
      throw new DisputeAlreadyExistsException();
    }

    const dispute = Dispute.create(command.projectId, command.reason);

    return this.disputesRepository.save(dispute);
  }
}
