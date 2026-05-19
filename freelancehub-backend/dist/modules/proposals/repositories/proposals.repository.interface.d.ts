import { ProposalEntity } from "../entities/proposal.entity";
export declare const PROPOSALS_REPOSITORY = "PROPOSALS_REPOSITORY";
export interface ProposalsRepository {
    findById(proposalId: string): Promise<ProposalEntity | null>;
    save(proposal: ProposalEntity): Promise<ProposalEntity>;
}
