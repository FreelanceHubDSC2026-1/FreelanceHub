import { Injectable, CanActivate, ExecutionContext, Inject, ForbiddenException } from '@nestjs/common';
import { DisputesRepository, ProjectsRepository } from '../../modules/disputes/services/open-dispute.service';
import { DisputeNotFoundException } from '../exceptions/dispute-not-found.exception';
import { ProjectNotFoundException } from '../exceptions/project-not-found.exception';
import { UnauthorizedDisputeException } from '../exceptions/unauthorized-dispute.exception';

/**
 * Guard de Autorização ABAC (Attribute-Based Access Control) para consulta de disputas.
 * Permite acesso total se o usuário for 'ADMIN'.
 * Permite acesso se o usuário for o Cliente ou Freelancer vinculado ao projeto da disputa.
 * Bloqueia o acesso (403 Forbidden) para qualquer outro usuário.
 */
@Injectable()
export class DisputeAccessGuard implements CanActivate {
  constructor(
    @Inject('DISPUTES_REPOSITORY')
    private readonly disputesRepository: DisputesRepository,
    
    @Inject('PROJECTS_REPOSITORY')
    private readonly projectsRepository: ProjectsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Se o usuário não estiver autenticado pelo JwtAuthGuard, bloqueia
    if (!user) {
      return false;
    }

    // 1. Administradores (Usuários com a role 'ADMIN') têm permissão total
    if (user.role === 'ADMIN') {
      return true;
    }

    // 2. Extrai o ID da disputa dos parâmetros da rota
    const disputeId = request.params.id;
    if (!disputeId) {
      return false;
    }

    // 3. Busca a disputa no repositório. Lança 404 se não existir
    const dispute = await this.disputesRepository.findById(disputeId);
    if (!dispute) {
      throw new DisputeNotFoundException();
    }

    // 4. Busca o projeto correspondente à disputa. Lança 404 se não existir
    const project = await this.projectsRepository.findById(dispute.projectId);
    if (!project) {
      throw new ProjectNotFoundException();
    }

    // 5. Valida se o usuário é participante direto do projeto
    const isParticipant = user.id === project.clientId || user.id === project.freelancerId;
    if (!isParticipant) {
      // Retorna 403 Forbidden lançando a exceção de negócio correspondente (mapeada no filtro)
      throw new UnauthorizedDisputeException();
    }

    return true;
  }
}
