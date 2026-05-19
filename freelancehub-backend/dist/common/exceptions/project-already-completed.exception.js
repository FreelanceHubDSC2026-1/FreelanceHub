"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectAlreadyCompletedException = void 0;
const common_1 = require("@nestjs/common");
class ProjectAlreadyCompletedException extends common_1.BadRequestException {
    constructor() {
        super('O projeto já foi concluído e não pode ser disputado.');
    }
}
exports.ProjectAlreadyCompletedException = ProjectAlreadyCompletedException;
//# sourceMappingURL=project-already-completed.exception.js.map