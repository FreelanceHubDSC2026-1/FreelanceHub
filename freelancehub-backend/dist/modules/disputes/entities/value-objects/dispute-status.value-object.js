"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputeStatus = void 0;
const dispute_status_enum_1 = require("../../../../common/enums/dispute-status.enum");
class DisputeStatus {
    constructor(value) {
        if (!value || !Object.values(dispute_status_enum_1.DisputeStatusEnum).includes(value)) {
            throw new Error(`Status de disputa inválido: ${value}`);
        }
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    isOpen() {
        return this.value === dispute_status_enum_1.DisputeStatusEnum.ABERTA;
    }
    isResolved() {
        return this.value === dispute_status_enum_1.DisputeStatusEnum.RESOLVIDA;
    }
    equals(other) {
        return this.value === other.getValue();
    }
}
exports.DisputeStatus = DisputeStatus;
//# sourceMappingURL=dispute-status.value-object.js.map