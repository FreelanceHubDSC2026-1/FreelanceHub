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
exports.DisputesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const dispute_entity_1 = require("../entities/dispute.entity");
const project_domain_1 = require("../entities/project.domain");
const project_not_found_exception_1 = require("../../../common/exceptions/project-not-found.exception");
const dispute_already_exists_exception_1 = require("../../../common/exceptions/dispute-already-exists.exception");
const disputes_repository_interface_1 = require("../repositories/disputes.repository.interface");
const projects_repository_interface_1 = require("../repositories/projects.repository.interface");
const infrastructure_mocks_1 = require("./infrastructure-mocks");
let DisputesService = class DisputesService {
    constructor(projectsRepository, disputesRepository, eventEmitter, paymentService, dataSource) {
        this.projectsRepository = projectsRepository;
        this.disputesRepository = disputesRepository;
        this.eventEmitter = eventEmitter;
        this.paymentService = paymentService;
        this.dataSource = dataSource;
    }
    async createDispute(command) {
        const projectData = await this.projectsRepository.findById(command.projectId);
        if (!projectData) {
            throw new project_not_found_exception_1.ProjectNotFoundException();
        }
        const project = new project_domain_1.Project(projectData.id, projectData.clientId, projectData.freelancerId, projectData.status);
        project.checkDisputeEligibility();
        project.checkUserAuthorization(command.userId);
        const existingDispute = await this.disputesRepository.findByProjectId(command.projectId);
        if (existingDispute) {
            throw new dispute_already_exists_exception_1.DisputeAlreadyExistsException();
        }
        let savedDispute;
        await this.dataSource.transaction(async (entityManager) => {
            const dispute = dispute_entity_1.DisputeEntity.create(command.projectId, command.reason);
            try {
                savedDispute = await entityManager.save(dispute_entity_1.DisputeEntity, dispute);
            }
            catch (error) {
                const isUniqueViolation = error?.code === '23505' ||
                    error?.message?.includes('unique constraint') ||
                    error?.message?.includes('duplicate key') ||
                    error?.message?.includes('UNIQUE constraint failed');
                if (isUniqueViolation) {
                    throw new dispute_already_exists_exception_1.DisputeAlreadyExistsException();
                }
                throw error;
            }
            await this.paymentService.blockPayment(command.projectId);
        });
        const occurredAt = new Date();
        this.eventEmitter.emit('DisputaAberta', {
            disputeId: savedDispute.id,
            projectId: savedDispute.projectId,
            userId: command.userId,
            reason: savedDispute.reason,
            occurredAt,
        });
        this.eventEmitter.emit('PagamentoBloqueado', {
            disputeId: savedDispute.id,
            projectId: savedDispute.projectId,
            userId: command.userId,
            status: 'BLOQUEADO',
            occurredAt,
        });
        return savedDispute;
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(projects_repository_interface_1.PROJECTS_REPOSITORY)),
    __param(1, (0, common_1.Inject)(disputes_repository_interface_1.DISPUTES_REPOSITORY)),
    __param(2, (0, common_1.Inject)(infrastructure_mocks_1.EVENT_EMITTER)),
    __param(3, (0, common_1.Inject)(infrastructure_mocks_1.PAYMENT_SERVICE)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, typeorm_1.DataSource])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map