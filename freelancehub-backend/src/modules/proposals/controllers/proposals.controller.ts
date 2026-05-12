import { Controller, Param, Post } from '@nestjs/common';
import { ConfirmProposalResponseDto } from '../dto/confirm-proposal-response.dto'; 
import { ProposalsService } from '../services/proposals.service';

@Controller('proposals') 
export class ProposalsController {  
    constructor(private readonly proposalsService: ProposalsService) {} 

    @Post(':id/confirm')  
    async confirmProposal(@Param('id') proposalId: string,  ): Promise<ConfirmProposalResponseDto> {
            return this.proposalsService.confirmProposal(proposalId);  
    } 
}