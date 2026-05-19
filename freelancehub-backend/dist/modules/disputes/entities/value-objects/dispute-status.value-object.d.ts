import { DisputeStatusEnum } from '../../../../common/enums/dispute-status.enum';
export declare class DisputeStatus {
    private readonly value;
    constructor(value: DisputeStatusEnum);
    getValue(): DisputeStatusEnum;
    isOpen(): boolean;
    isResolved(): boolean;
    equals(other: DisputeStatus): boolean;
}
