"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dispute_entity_1 = require("./entities/dispute.entity");
const project_entity_1 = require("./entities/project.entity");
const disputes_typeorm_repository_1 = require("./repositories/disputes.typeorm.repository");
const projects_typeorm_repository_1 = require("./repositories/projects.typeorm.repository");
const disputes_repository_interface_1 = require("./repositories/disputes.repository.interface");
const projects_repository_interface_1 = require("./repositories/projects.repository.interface");
const infrastructure_mocks_1 = require("./services/infrastructure-mocks");
const disputes_service_1 = require("./services/disputes.service");
const disputes_controller_1 = require("./controllers/disputes.controller");
const disputes_query_controller_1 = require("./controllers/disputes-query.controller");
const get_dispute_service_1 = require("./services/get-dispute.service");
let DisputesModule = class DisputesModule {
};
exports.DisputesModule = DisputesModule;
exports.DisputesModule = DisputesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([dispute_entity_1.DisputeEntity, project_entity_1.ProjectEntity]),
        ],
        controllers: [
            disputes_controller_1.DisputesController,
            disputes_query_controller_1.DisputesQueryController,
        ],
        providers: [
            disputes_service_1.DisputesService,
            get_dispute_service_1.GetDisputeService,
            {
                provide: disputes_repository_interface_1.DISPUTES_REPOSITORY,
                useClass: disputes_typeorm_repository_1.DisputesTypeOrmRepository,
            },
            {
                provide: projects_repository_interface_1.PROJECTS_REPOSITORY,
                useClass: projects_typeorm_repository_1.ProjectsTypeOrmRepository,
            },
            {
                provide: infrastructure_mocks_1.EVENT_EMITTER,
                useClass: infrastructure_mocks_1.ConsoleEventEmitter,
            },
            {
                provide: infrastructure_mocks_1.PAYMENT_SERVICE,
                useClass: infrastructure_mocks_1.ConsolePaymentService,
            },
        ],
        exports: [
            disputes_repository_interface_1.DISPUTES_REPOSITORY,
            projects_repository_interface_1.PROJECTS_REPOSITORY,
            disputes_service_1.DisputesService,
            get_dispute_service_1.GetDisputeService,
        ],
    })
], DisputesModule);
//# sourceMappingURL=disputes.module.js.map