import { DataSource } from 'typeorm';
import { DisputeEntity } from '../entities/dispute.entity';
import { DisputesRepository } from '../repositories/disputes.repository.interface';
import { ProjectsRepository } from '../repositories/projects.repository.interface';
import { EventEmitter, PaymentService } from './infrastructure-mocks';
export interface CreateDisputeCommand {
    projectId: string;
    userId: string;
    reason: string;
}
export declare class DisputesService {
    private readonly projectsRepository;
    private readonly disputesRepository;
    private readonly eventEmitter;
    private readonly paymentService;
    private readonly dataSource;
    constructor(projectsRepository: ProjectsRepository, disputesRepository: DisputesRepository, eventEmitter: EventEmitter, paymentService: PaymentService, dataSource: DataSource);
    createDispute(command: CreateDisputeCommand): Promise<DisputeEntity>;
}
