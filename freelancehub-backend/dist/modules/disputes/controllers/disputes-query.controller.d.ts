import { GetDisputeService } from '../services/get-dispute.service';
export declare class DisputesQueryController {
    private readonly getDisputeService;
    constructor(getDisputeService: GetDisputeService);
    getDispute(id: string): Promise<import("../entities/dispute.entity").DisputeEntity>;
}
