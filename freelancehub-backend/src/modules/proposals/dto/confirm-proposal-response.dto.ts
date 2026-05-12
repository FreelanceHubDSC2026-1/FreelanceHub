import { ProposalStatusEnum } from "../../../common/enums/proposal-status.enum";

export class ConfirmProposalResponseDto {
    constructor(
        public proposalId: string,
        public proposalStatus: ProposalStatusEnum,
    ) { }
}