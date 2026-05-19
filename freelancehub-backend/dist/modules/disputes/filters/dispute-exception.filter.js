"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputeExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const unauthorized_dispute_exception_1 = require("../../../common/exceptions/unauthorized-dispute.exception");
const project_not_found_exception_1 = require("../../../common/exceptions/project-not-found.exception");
const dispute_already_exists_exception_1 = require("../../../common/exceptions/dispute-already-exists.exception");
const project_cancelled_exception_1 = require("../../../common/exceptions/project-cancelled.exception");
const dispute_not_found_exception_1 = require("../../../common/exceptions/dispute-not-found.exception");
const invalid_dispute_reason_exception_1 = require("../../../common/exceptions/invalid-dispute-reason.exception");
let DisputeExceptionFilter = class DisputeExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = exception.message || 'Erro interno do servidor';
        if (exception instanceof unauthorized_dispute_exception_1.UnauthorizedDisputeException) {
            status = common_1.HttpStatus.FORBIDDEN;
            message = exception.message;
        }
        else if (exception instanceof project_not_found_exception_1.ProjectNotFoundException) {
            status = common_1.HttpStatus.NOT_FOUND;
            message = exception.message;
        }
        else if (exception instanceof dispute_not_found_exception_1.DisputeNotFoundException) {
            status = common_1.HttpStatus.NOT_FOUND;
            message = exception.message;
        }
        else if (exception instanceof dispute_already_exists_exception_1.DisputeAlreadyExistsException) {
            status = common_1.HttpStatus.CONFLICT;
            message = exception.message;
        }
        else if (exception instanceof project_cancelled_exception_1.ProjectCancelledException) {
            status = common_1.HttpStatus.CONFLICT;
            message = exception.message;
        }
        else if (exception instanceof invalid_dispute_reason_exception_1.InvalidDisputeReasonException) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = exception.message;
        }
        else if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const responseBody = exception.getResponse();
            message = typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody
                ? responseBody.message
                : exception.message;
        }
        response.status(status).json({
            statusCode: status,
            message: message,
            error: common_1.HttpStatus[status] || 'Error',
        });
    }
};
exports.DisputeExceptionFilter = DisputeExceptionFilter;
exports.DisputeExceptionFilter = DisputeExceptionFilter = __decorate([
    (0, common_1.Catch)()
], DisputeExceptionFilter);
//# sourceMappingURL=dispute-exception.filter.js.map