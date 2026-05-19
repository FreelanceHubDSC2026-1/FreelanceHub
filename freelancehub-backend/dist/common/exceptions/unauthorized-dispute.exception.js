"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedDisputeException = void 0;
const common_1 = require("@nestjs/common");
class UnauthorizedDisputeException extends common_1.ForbiddenException {
    constructor() {
        super('Apenas o cliente ou o freelancer associados ao projeto podem abrir uma disputa.');
    }
}
exports.UnauthorizedDisputeException = UnauthorizedDisputeException;
//# sourceMappingURL=unauthorized-dispute.exception.js.map