"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectCancelledException = void 0;
const common_1 = require("@nestjs/common");
class ProjectCancelledException extends common_1.BadRequestException {
    constructor() {
        super('Não é possível abrir disputa para um projeto cancelado.');
    }
}
exports.ProjectCancelledException = ProjectCancelledException;
//# sourceMappingURL=project-cancelled.exception.js.map