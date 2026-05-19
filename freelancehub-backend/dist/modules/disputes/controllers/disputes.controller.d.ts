import { DisputesService } from '../services/disputes.service';
import { CreateDisputeDto } from '../dto/create-dispute.dto';
export declare class DisputesController {
    private readonly disputesService;
    constructor(disputesService: DisputesService);
    createDispute(projectId: string, createDisputeDto: CreateDisputeDto, req: any): Promise<import("../entities/dispute.entity").DisputeEntity>;
}
