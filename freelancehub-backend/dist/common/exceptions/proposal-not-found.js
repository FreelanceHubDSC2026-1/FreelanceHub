"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class ProposalNotFoundException extends common_1.NotFoundException {
    constructor(proposalId) {
        super(`Proposal with id "${proposalId}" was not found.`);
    }
}
exports.ProposalNotFoundException = ProposalNotFoundException;
//# sourceMappingURL=proposal-not-found.js.map