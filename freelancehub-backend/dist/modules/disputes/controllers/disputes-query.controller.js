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
exports.DisputesQueryController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const dispute_access_guard_1 = require("../../../common/guards/dispute-access.guard");
const dispute_exception_filter_1 = require("../filters/dispute-exception.filter");
const get_dispute_service_1 = require("../services/get-dispute.service");
let DisputesQueryController = class DisputesQueryController {
    constructor(getDisputeService) {
        this.getDisputeService = getDisputeService;
    }
    async getDispute(id) {
        return await this.getDisputeService.execute(id);
    }
};
exports.DisputesQueryController = DisputesQueryController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, dispute_access_guard_1.DisputeAccessGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DisputesQueryController.prototype, "getDispute", null);
exports.DisputesQueryController = DisputesQueryController = __decorate([
    (0, common_1.Controller)('disputas'),
    (0, common_1.UseFilters)(dispute_exception_filter_1.DisputeExceptionFilter),
    __metadata("design:paramtypes", [get_dispute_service_1.GetDisputeService])
], DisputesQueryController);
//# sourceMappingURL=disputes-query.controller.js.map