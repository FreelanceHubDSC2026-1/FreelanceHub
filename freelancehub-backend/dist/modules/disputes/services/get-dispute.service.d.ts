import { DisputesRepository } from '../repositories/disputes.repository.interface';
import { DisputeEntity } from '../entities/dispute.entity';
export declare class GetDisputeService {
    private readonly disputesRepository;
    constructor(disputesRepository: DisputesRepository);
    execute(id: string): Promise<DisputeEntity>;
}
