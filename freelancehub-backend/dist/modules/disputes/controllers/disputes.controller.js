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
exports.DisputesController = void 0;
const common_1 = require("@nestjs/common");
const disputes_service_1 = require("../services/disputes.service");
const create_dispute_dto_1 = require("../dto/create-dispute.dto");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const dispute_exception_filter_1 = require("../filters/dispute-exception.filter");
let DisputesController = class DisputesController {
    constructor(disputesService) {
        this.disputesService = disputesService;
    }
    async createDispute(projectId, createDisputeDto, req) {
        const userId = req.user.id;
        return await this.disputesService.createDispute({
            projectId,
            userId,
            reason: createDisputeDto.reason,
        });
    }
};
exports.DisputesController = DisputesController;
__decorate([
    (0, common_1.Post)(':id/disputas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_dispute_dto_1.CreateDisputeDto, Object]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "createDispute", null);
exports.DisputesController = DisputesController = __decorate([
    (0, common_1.Controller)('projetos'),
    (0, common_1.UseFilters)(dispute_exception_filter_1.DisputeExceptionFilter),
    __metadata("design:paramtypes", [disputes_service_1.DisputesService])
], DisputesController);
//# sourceMappingURL=disputes.controller.js.map