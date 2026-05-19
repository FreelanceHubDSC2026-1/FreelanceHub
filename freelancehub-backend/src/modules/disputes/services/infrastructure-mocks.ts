import { Injectable } from '@nestjs/common';

export interface EventEmitter {
  emit(event: string, data: any): void;
}

export interface PaymentService {
  blockPayment(projectId: string): Promise<void>;
}

export const EVENT_EMITTER = 'EVENT_EMITTER';
export const PAYMENT_SERVICE = 'PAYMENT_SERVICE';

@Injectable()
export class ConsoleEventEmitter implements EventEmitter {
  emit(event: string, data: any): void {
    console.log(`[Event Emitted] ${event}:`, JSON.stringify(data, null, 2));
  }
}

@Injectable()
export class ConsolePaymentService implements PaymentService {
  async blockPayment(projectId: string): Promise<void> {
    console.log(`[Payment Blocked] for project: ${projectId}`);
  }
}
