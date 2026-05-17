import { NotFoundException } from '@nestjs/common';

export class ProjectNotFoundException extends NotFoundException {
  constructor() {
    super('O projeto especificado não foi encontrado.');
  }
}
