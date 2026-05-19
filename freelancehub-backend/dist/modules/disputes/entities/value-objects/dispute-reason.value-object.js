"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputeReason = void 0;
const invalid_dispute_reason_exception_1 = require("../../../../common/exceptions/invalid-dispute-reason.exception");
class DisputeReason {
    constructor(value) {
        if (!value || value.trim().length < 10) {
            throw new invalid_dispute_reason_exception_1.InvalidDisputeReasonException();
        }
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    equals(other) {
        return this.value === other.getValue();
    }
}
exports.DisputeReason = DisputeReason;
//# sourceMappingURL=dispute-reason.value-object.js.map