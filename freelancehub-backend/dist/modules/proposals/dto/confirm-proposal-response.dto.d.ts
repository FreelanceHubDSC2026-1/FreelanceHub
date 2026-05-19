import { ProposalStatusEnum } from "../../../common/enums/proposal-status.enum";
export declare class ConfirmProposalResponseDto {
    proposalId: string;
    proposalStatus: ProposalStatusEnum;
    constructor(proposalId: string, proposalStatus: ProposalStatusEnum);
}
