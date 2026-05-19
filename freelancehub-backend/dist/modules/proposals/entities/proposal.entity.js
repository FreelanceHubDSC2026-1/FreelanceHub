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
exports.ProposalEntity = void 0;
const proposal_status_enum_1 = require("../../../common/enums/proposal-status.enum");
const typeorm_1 = require("typeorm");
let ProposalEntity = class ProposalEntity {
};
exports.ProposalEntity = ProposalEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'proposal_id' }),
    __metadata("design:type", String)
], ProposalEntity.prototype, "proposalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value' }),
    __metadata("design:type", Number)
], ProposalEntity.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_time' }),
    __metadata("design:type", Date)
], ProposalEntity.prototype, "deliveryTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'freelancer_id' }),
    __metadata("design:type", String)
], ProposalEntity.prototype, "freelancerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'project_id' }),
    __metadata("design:type", String)
], ProposalEntity.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: proposal_status_enum_1.ProposalStatusEnum,
        default: proposal_status_enum_1.ProposalStatusEnum.PENDING,
    }),
    __metadata("design:type", String)
], ProposalEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ProposalEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ProposalEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], ProposalEntity.prototype, "deletedAt", void 0);
exports.ProposalEntity = ProposalEntity = __decorate([
    (0, typeorm_1.Entity)('proposals')
], ProposalEntity);
//# sourceMappingURL=proposal.entity.js.map