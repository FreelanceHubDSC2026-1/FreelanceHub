"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsolePaymentService = exports.ConsoleEventEmitter = exports.PAYMENT_SERVICE = exports.EVENT_EMITTER = void 0;
const common_1 = require("@nestjs/common");
exports.EVENT_EMITTER = 'EVENT_EMITTER';
exports.PAYMENT_SERVICE = 'PAYMENT_SERVICE';
let ConsoleEventEmitter = class ConsoleEventEmitter {
    emit(event, data) {
        console.log(`[Event Emitted] ${event}:`, JSON.stringify(data, null, 2));
    }
};
exports.ConsoleEventEmitter = ConsoleEventEmitter;
exports.ConsoleEventEmitter = ConsoleEventEmitter = __decorate([
    (0, common_1.Injectable)()
], ConsoleEventEmitter);
let ConsolePaymentService = class ConsolePaymentService {
    async blockPayment(projectId) {
        console.log(`[Payment Blocked] for project: ${projectId}`);
    }
};
exports.ConsolePaymentService = ConsolePaymentService;
exports.ConsolePaymentService = ConsolePaymentService = __decorate([
    (0, common_1.Injectable)()
], ConsolePaymentService);
//# sourceMappingURL=infrastructure-mocks.js.map