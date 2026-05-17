import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) para validação do payload de criação de disputas.
 */
export class CreateDisputeDto {
  @IsString({ message: 'O motivo deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O motivo da disputa é obrigatório e não pode estar vazio.' })
  @MinLength(10, { message: 'O motivo deve conter pelo menos 10 caracteres explicativos.' })
  reason: string;
}
