import { NotFoundException } from '@nestjs/common';
export declare class ProposalNotFoundException extends NotFoundException {
    constructor(proposalId: string);
}
