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
exports.DisputeAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const disputes_repository_interface_1 = require("../../modules/disputes/repositories/disputes.repository.interface");
const projects_repository_interface_1 = require("../../modules/disputes/repositories/projects.repository.interface");
const project_domain_1 = require("../../modules/disputes/entities/project.domain");
const dispute_not_found_exception_1 = require("../exceptions/dispute-not-found.exception");
const project_not_found_exception_1 = require("../exceptions/project-not-found.exception");
let DisputeAccessGuard = class DisputeAccessGuard {
    constructor(disputesRepository, projectsRepository) {
        this.disputesRepository = disputesRepository;
        this.projectsRepository = projectsRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return false;
        }
        if (user.role === 'ADMIN') {
            return true;
        }
        const disputeId = request.params.id;
        if (!disputeId) {
            return false;
        }
        const dispute = await this.disputesRepository.findById(disputeId);
        if (!dispute) {
            throw new dispute_not_found_exception_1.DisputeNotFoundException();
        }
        const projectData = await this.projectsRepository.findById(dispute.projectId);
        if (!projectData) {
            throw new project_not_found_exception_1.ProjectNotFoundException();
        }
        const project = new project_domain_1.Project(projectData.id, projectData.clientId, projectData.freelancerId, projectData.status);
        project.checkUserAuthorization(user.id);
        return true;
    }
};
exports.DisputeAccessGuard = DisputeAccessGuard;
exports.DisputeAccessGuard = DisputeAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(disputes_repository_interface_1.DISPUTES_REPOSITORY)),
    __param(1, (0, common_1.Inject)(projects_repository_interface_1.PROJECTS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], DisputeAccessGuard);
//# sourceMappingURL=dispute-access.guard.js.map