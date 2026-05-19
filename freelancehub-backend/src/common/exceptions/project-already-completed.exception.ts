import { BadRequestException } from '@nestjs/common';

export class ProjectAlreadyCompletedException extends BadRequestException {
  constructor() {
    super('O projeto já foi concluído e não pode ser disputado.');
  }
}
