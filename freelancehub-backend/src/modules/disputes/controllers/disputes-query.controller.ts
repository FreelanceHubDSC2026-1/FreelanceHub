import { Controller, Get, Param, UseGuards, UseFilters, ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { DisputeAccessGuard } from '../../../common/guards/dispute-access.guard';
import { DisputeExceptionFilter } from '../filters/dispute-exception.filter';
import { GetDisputeService } from '../services/get-dispute.service';

/**
 * Controller focado em consultas e visualização de disputas de forma segura (RBAC/ABAC).
 * Expõe a rota GET /disputas/:id protegida por JWT e regras de negócio de autorização de recurso.
 */
@Controller('disputas')
@UseFilters(DisputeExceptionFilter)
export class DisputesQueryController {
  constructor(private readonly getDisputeService: GetDisputeService) {}

  /**
   * Endpoint de consulta de detalhes de disputa.
   * Regras de acesso aplicadas via DisputeAccessGuard (ABAC/Roles):
   * - ADMIN tem permissão total.
   * - Cliente e Freelancer vinculados ao projeto da disputa têm acesso.
   * - Outros usuários têm acesso negado (403).
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, DisputeAccessGuard)
  async getDispute(@Param('id', ParseUUIDPipe) id: string) {
    return await this.getDisputeService.execute(id);
  }
}
