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
exports.DisputesTypeOrmRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dispute_entity_1 = require("../entities/dispute.entity");
const dispute_already_exists_exception_1 = require("../../../common/exceptions/dispute-already-exists.exception");
let DisputesTypeOrmRepository = class DisputesTypeOrmRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async save(dispute) {
        try {
            return await this.repository.save(dispute);
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
    }
    async findByProjectId(projectId) {
        return await this.repository.findOne({
            where: { projectId },
        });
    }
    async findById(id) {
        return await this.repository.findOne({
            where: { id },
        });
    }
};
exports.DisputesTypeOrmRepository = DisputesTypeOrmRepository;
exports.DisputesTypeOrmRepository = DisputesTypeOrmRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dispute_entity_1.DisputeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DisputesTypeOrmRepository);
//# sourceMappingURL=disputes.typeorm.repository.js.map