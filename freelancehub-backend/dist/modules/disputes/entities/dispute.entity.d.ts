import { DisputeStatusEnum } from '../../../common/enums/dispute-status.enum';
import { DisputeReason } from './value-objects/dispute-reason.value-object';
import { DisputeStatus } from './value-objects/dispute-status.value-object';
import { ProjectEntity } from './project.entity';
export interface DomainEvent {
    dateTimeOccurred: Date;
}
export declare class DisputeOpenedEvent implements DomainEvent {
    readonly projectId: string;
    readonly reason: string;
    dateTimeOccurred: Date;
    constructor(projectId: string, reason: string);
}
export declare class DisputeEntity {
    id: string;
    projectId: string;
    project: ProjectEntity;
    reason: string;
    status: DisputeStatusEnum;
    isPaymentBlocked: boolean;
    createdAt: Date;
    private _domainEvents;
    get domainEvents(): DomainEvent[];
    clearEvents(): void;
    static create(projectId: string, reason: string): DisputeEntity;
    openDispute(): void;
    get disputeReason(): DisputeReason;
    get disputeStatus(): DisputeStatus;
}
