import { NotFoundException } from '@nestjs/common';

/**
 * Exceção lançada quando uma disputa solicitada não é encontrada pelo ID.
 */
export class DisputeNotFoundException extends NotFoundException {
  constructor() {
    super('A disputa especificada não foi encontrada.');
  }
}
