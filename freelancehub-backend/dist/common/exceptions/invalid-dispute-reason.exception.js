"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidDisputeReasonException = void 0;
const common_1 = require("@nestjs/common");
class InvalidDisputeReasonException extends common_1.BadRequestException {
    constructor() {
        super('O motivo da disputa deve conter pelo menos 10 caracteres explicativos.');
    }
}
exports.InvalidDisputeReasonException = InvalidDisputeReasonException;
//# sourceMappingURL=invalid-dispute-reason.exception.js.map