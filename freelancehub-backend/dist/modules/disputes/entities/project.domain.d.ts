export declare class Project {
    readonly id: string;
    readonly clientId: string;
    readonly freelancerId: string;
    readonly status: string;
    constructor(id: string, clientId: string, freelancerId: string, status: string);
    isParticipant(userId: string): boolean;
    checkDisputeEligibility(): void;
    checkUserAuthorization(userId: string): void;
}
