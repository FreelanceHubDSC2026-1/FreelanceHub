export interface EventEmitter {
    emit(event: string, data: any): void;
}
export interface PaymentService {
    blockPayment(projectId: string): Promise<void>;
}
export declare const EVENT_EMITTER = "EVENT_EMITTER";
export declare const PAYMENT_SERVICE = "PAYMENT_SERVICE";
export declare class ConsoleEventEmitter implements EventEmitter {
    emit(event: string, data: any): void;
}
export declare class ConsolePaymentService implements PaymentService {
    blockPayment(projectId: string): Promise<void>;
}
