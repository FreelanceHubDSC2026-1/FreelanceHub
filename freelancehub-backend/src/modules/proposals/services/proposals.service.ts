import { Inject, Injectable } from "@nestjs/common";
import { PROPOSALS_REPOSITORY } from "../repositories/proposals.repository.interface";
import type { ProposalsRepository } from "../repositories/proposals.repository.interface";
import { ConfirmProposalResponseDto } from "../dto/confirm-proposal-response.dto";
import { ProposalNotFoundException } from "../../../common/exceptions/proposal-not-found";
import { ProposalStatusEnum } from "../../../common/enums/proposal-status.enum";

@Injectable()
export class ProposalsService {
    constructor(
        @Inject(PROPOSALS_REPOSITORY)
        private readonly proposalsRepository: ProposalsRepository,
    ) { }

    async confirmProposal(proposalId: string): Promise<ConfirmProposalResponseDto> {
        const proposal = await this.proposalsRepository.findById(proposalId);

        if (!proposal) {
            throw new ProposalNotFoundException(proposalId);
        }

        //proposal.status = ProposalStatusEnum.CONFIRMED;
        proposal.updatedAt = new Date();
        const savedProposal = await this.proposalsRepository.save(proposal);

        return {
            proposalId: savedProposal.proposalId,
            proposalStatus: savedProposal.status,
        };
    }

}