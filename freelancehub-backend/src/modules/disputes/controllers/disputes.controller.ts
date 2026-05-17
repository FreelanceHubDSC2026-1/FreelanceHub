import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  UseFilters,
  Req,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OpenDisputeService } from '../services/open-dispute.service';
import { CreateDisputeDto } from '../dto/create-dispute.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { DisputeExceptionFilter } from '../filters/dispute-exception.filter';

/**
 * Controller responsável pelas requisições HTTP associadas ao recurso de Disputas.
 * Mapeia o endpoint POST /projetos/:id/disputas de acordo com a UC13.8.
 */
@Controller('projetos')
@UseFilters(DisputeExceptionFilter)
export class DisputesController {
  constructor(private readonly openDisputeService: OpenDisputeService) {}

  /**
   * Endpoint de abertura de disputa para um determinado projeto.
   * Requer autenticação (JWT) e validação robusta de parâmetros e payload.
   */
  @Post(':id/disputas')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED) // Status HTTP 201 (Created) implícito, mas definido explicitamente para clareza
  async createDispute(
    @Param('id', ParseUUIDPipe) projectId: string,
    @Body() createDisputeDto: CreateDisputeDto,
    @Req() req: any,
  ) {
    // Recupera o ID do usuário autenticado a partir do request context injetado pelo Guard
    const userId = req.user.id;

    // Executa o caso de uso (Application Service) de abertura de disputa
    return await this.openDisputeService.execute({
      projectId,
      userId,
      reason: createDisputeDto.reason,
    });
  }
}
