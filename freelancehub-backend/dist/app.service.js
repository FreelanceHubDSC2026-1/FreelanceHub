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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const project_entity_1 = require("./modules/disputes/entities/project.entity");
let AppService = class AppService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    getHello() {
        return 'Hello World!';
    }
    async onApplicationBootstrap() {
        console.log('[Seeder] Starting database seeding for TDD scenarios...');
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const eligibleProjectId = '7f80db45-7975-4c6c-829d-9f4a6ebf9629';
            let eligibleProject = await queryRunner.manager.findOne(project_entity_1.ProjectEntity, { where: { id: eligibleProjectId } });
            if (!eligibleProject) {
                eligibleProject = queryRunner.manager.create(project_entity_1.ProjectEntity, {
                    id: eligibleProjectId,
                    clientId: 'client-participant-111',
                    freelancerId: 'freelancer-participant-222',
                    status: 'IN_PROGRESS',
                });
                await queryRunner.manager.save(project_entity_1.ProjectEntity, eligibleProject);
                console.log(`[Seeder] Seeded project ${eligibleProjectId} (IN_PROGRESS)`);
            }
            const cancelledProjectId = '9c90db45-7975-4c6c-829d-9f4a6ebf9629';
            let cancelledProject = await queryRunner.manager.findOne(project_entity_1.ProjectEntity, { where: { id: cancelledProjectId } });
            if (!cancelledProject) {
                cancelledProject = queryRunner.manager.create(project_entity_1.ProjectEntity, {
                    id: cancelledProjectId,
                    clientId: 'client-participant-111',
                    freelancerId: 'freelancer-participant-222',
                    status: 'CANCELLED',
                });
                await queryRunner.manager.save(project_entity_1.ProjectEntity, cancelledProject);
                console.log(`[Seeder] Seeded project ${cancelledProjectId} (CANCELLED)`);
            }
            console.log('[Seeder] Seeding finished successfully.');
        }
        catch (err) {
            console.error('[Seeder] Error during database seeding:', err);
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AppService);
//# sourceMappingURL=app.service.js.map