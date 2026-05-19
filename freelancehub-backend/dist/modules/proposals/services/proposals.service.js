"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalsService = void 0;
const common_1 = require("@nestjs/common");
const proposals_repository_interface_1 = require("../repositories/proposals.repository.interface");
const proposal_not_found_1 = require("../../../common/exceptions/proposal-not-found");
let ProposalsService = class ProposalsService {
    constructor(proposalsRepository) {
        this.proposalsRepository = proposalsRepository;
    }
    async confirmProposal(proposalId) {
        const proposal = await this.proposalsRepository.findById(proposalId);
        if (!proposal) {
            throw new proposal_not_found_1.ProposalNotFoundException(proposalId);
        }
        proposal.updatedAt = new Date();
        const savedProposal = await this.proposalsRepository.save(proposal);
        return {
            proposalId: savedProposal.proposalId,
            proposalStatus: savedProposal.status,
        };
    }
};
exports.ProposalsService = ProposalsService;
exports.ProposalsService = ProposalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(proposals_repository_interface_1.PROPOSALS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ProposalsService);
//# sourceMappingURL=proposals.service.js.map