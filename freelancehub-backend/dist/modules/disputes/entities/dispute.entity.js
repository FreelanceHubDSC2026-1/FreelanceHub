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
var DisputeEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputeEntity = exports.DisputeOpenedEvent = void 0;
const typeorm_1 = require("typeorm");
const dispute_status_enum_1 = require("../../../common/enums/dispute-status.enum");
const dispute_reason_value_object_1 = require("./value-objects/dispute-reason.value-object");
const dispute_status_value_object_1 = require("./value-objects/dispute-status.value-object");
const project_entity_1 = require("./project.entity");
class DisputeOpenedEvent {
    constructor(projectId, reason) {
        this.projectId = projectId;
        this.reason = reason;
        this.dateTimeOccurred = new Date();
    }
}
exports.DisputeOpenedEvent = DisputeOpenedEvent;
let DisputeEntity = DisputeEntity_1 = class DisputeEntity {
    constructor() {
        this._domainEvents = [];
    }
    get domainEvents() {
        return this._domainEvents;
    }
    clearEvents() {
        this._domainEvents = [];
    }
    static create(projectId, reason) {
        const dispute = new DisputeEntity_1();
        dispute.projectId = projectId;
        const disputeReason = new dispute_reason_value_object_1.DisputeReason(reason);
        dispute.reason = disputeReason.getValue();
        dispute.openDispute();
        return dispute;
    }
    openDispute() {
        this.status = dispute_status_enum_1.DisputeStatusEnum.ABERTA;
        this.isPaymentBlocked = true;
        if (!this.createdAt) {
            this.createdAt = new Date();
        }
        this._domainEvents.push(new DisputeOpenedEvent(this.projectId, this.reason));
    }
    get disputeReason() {
        return new dispute_reason_value_object_1.DisputeReason(this.reason);
    }
    get disputeStatus() {
        return new dispute_status_value_object_1.DisputeStatus(this.status);
    }
};
exports.DisputeEntity = DisputeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DisputeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], DisputeEntity.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.ProjectEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'projectId' }),
    __metadata("design:type", project_entity_1.ProjectEntity)
], DisputeEntity.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], DisputeEntity.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: dispute_status_enum_1.DisputeStatusEnum,
        default: dispute_status_enum_1.DisputeStatusEnum.ABERTA,
    }),
    __metadata("design:type", String)
], DisputeEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], DisputeEntity.prototype, "isPaymentBlocked", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DisputeEntity.prototype, "createdAt", void 0);
exports.DisputeEntity = DisputeEntity = DisputeEntity_1 = __decorate([
    (0, typeorm_1.Entity)('disputes')
], DisputeEntity);
//# sourceMappingURL=dispute.entity.js.map