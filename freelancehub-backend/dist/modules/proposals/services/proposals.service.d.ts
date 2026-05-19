import type { ProposalsRepository } from "../repositories/proposals.repository.interface";
import { ConfirmProposalResponseDto } from "../dto/confirm-proposal-response.dto";
export declare class ProposalsService {
    private readonly proposalsRepository;
    constructor(proposalsRepository: ProposalsRepository);
    confirmProposal(proposalId: string): Promise<ConfirmProposalResponseDto>;
}
