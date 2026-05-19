import { BadRequestException } from '@nestjs/common';

export class InvalidDisputeReasonException extends BadRequestException {
  constructor() {
    super('O motivo da disputa deve conter pelo menos 10 caracteres explicativos.');
  }
}
