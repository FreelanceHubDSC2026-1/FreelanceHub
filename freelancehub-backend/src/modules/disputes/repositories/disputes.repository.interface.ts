import { DisputeEntity } from '../entities/dispute.entity';

export const DISPUTES_REPOSITORY = 'DISPUTES_REPOSITORY';

export interface DisputesRepository {
  save(dispute: DisputeEntity): Promise<DisputeEntity>;
  findByProjectId(projectId: string): Promise<DisputeEntity | null>;
  findById(id: string): Promise<DisputeEntity | null>;
}
