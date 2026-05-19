"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const project_cancelled_exception_1 = require("../../../common/exceptions/project-cancelled.exception");
const project_already_completed_exception_1 = require("../../../common/exceptions/project-already-completed.exception");
const unauthorized_dispute_exception_1 = require("../../../common/exceptions/unauthorized-dispute.exception");
class Project {
    constructor(id, clientId, freelancerId, status) {
        this.id = id;
        this.clientId = clientId;
        this.freelancerId = freelancerId;
        this.status = status;
    }
    isParticipant(userId) {
        return userId === this.clientId || userId === this.freelancerId;
    }
    checkDisputeEligibility() {
        if (this.status === 'CANCELLED' || this.status === 'Cancelado') {
            throw new project_cancelled_exception_1.ProjectCancelledException();
        }
        if (this.status === 'COMPLETED') {
            throw new project_already_completed_exception_1.ProjectAlreadyCompletedException();
        }
    }
    checkUserAuthorization(userId) {
        if (!this.isParticipant(userId)) {
            throw new unauthorized_dispute_exception_1.UnauthorizedDisputeException();
        }
    }
}
exports.Project = Project;
//# sourceMappingURL=project.domain.js.map