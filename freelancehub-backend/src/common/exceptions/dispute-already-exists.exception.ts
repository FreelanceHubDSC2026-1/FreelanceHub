import { ConflictException } from '@nestjs/common';

export class DisputeAlreadyExistsException extends ConflictException {
  constructor() {
    super('Já existe uma disputa em andamento para este projeto.');
  }
}
