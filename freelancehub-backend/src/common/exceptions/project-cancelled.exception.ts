import { BadRequestException } from '@nestjs/common';

export class ProjectCancelledException extends BadRequestException {
  constructor() {
    super('Não é possível abrir disputa para um projeto cancelado.');
  }
}
