"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputeAlreadyExistsException = void 0;
const common_1 = require("@nestjs/common");
class DisputeAlreadyExistsException extends common_1.ConflictException {
    constructor() {
        super('Já existe uma disputa em andamento para este projeto.');
    }
}
exports.DisputeAlreadyExistsException = DisputeAlreadyExistsException;
//# sourceMappingURL=dispute-already-exists.exception.js.map