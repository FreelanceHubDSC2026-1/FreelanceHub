import { Repository } from 'typeorm';
import { DisputeEntity } from '../entities/dispute.entity';
import { DisputesRepository } from './disputes.repository.interface';
export declare class DisputesTypeOrmRepository implements DisputesRepository {
    private readonly repository;
    constructor(repository: Repository<DisputeEntity>);
    save(dispute: DisputeEntity): Promise<DisputeEntity>;
    findByProjectId(projectId: string): Promise<DisputeEntity | null>;
    findById(id: string): Promise<DisputeEntity | null>;
}
