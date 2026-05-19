import { UnauthorizedException } from '@nestjs/common';

export class UnauthorizedDisputeException extends UnauthorizedException {
  constructor() {
    super('Apenas o cliente ou o freelancer associados ao projeto podem abrir uma disputa.');
  }
}
