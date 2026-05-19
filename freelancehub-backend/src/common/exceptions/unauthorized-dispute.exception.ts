import { ForbiddenException } from '@nestjs/common';

export class UnauthorizedDisputeException extends ForbiddenException {
  constructor() {
    super('Apenas o cliente ou o freelancer associados ao projeto podem abrir uma disputa.');
  }
}
