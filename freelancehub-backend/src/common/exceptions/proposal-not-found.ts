import { NotFoundException } from '@nestjs/common';

export class ProposalNotFoundException extends NotFoundException {
  constructor(proposalId: string) {
    super(`Proposal with id "${proposalId}" was not found.`);
  }
}