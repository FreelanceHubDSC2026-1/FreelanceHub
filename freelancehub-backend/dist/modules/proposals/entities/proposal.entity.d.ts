import { ProposalStatusEnum } from "../../../common/enums/proposal-status.enum";
export declare class ProposalEntity {
    proposalId: string;
    value: number;
    deliveryTime: Date;
    freelancerId: string;
    projectId: string;
    status: ProposalStatusEnum;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
