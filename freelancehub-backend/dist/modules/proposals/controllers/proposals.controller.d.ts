import { ConfirmProposalResponseDto } from '../dto/confirm-proposal-response.dto';
import { ProposalsService } from '../services/proposals.service';
export declare class ProposalsController {
    private readonly proposalsService;
    constructor(proposalsService: ProposalsService);
    confirmProposal(proposalId: string): Promise<ConfirmProposalResponseDto>;
}
