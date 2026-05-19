import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { DISPUTES_REPOSITORY, DisputesRepository } from '../../modules/disputes/repositories/disputes.repository.interface';
import { PROJECTS_REPOSITORY, ProjectsRepository } from '../../modules/disputes/repositories/projects.repository.interface';
import { Project } from '../../modules/disputes/entities/project.domain';
import { DisputeNotFoundException } from '../exceptions/dispute-not-found.exception';
import { ProjectNotFoundException } from '../exceptions/project-not-found.exception';

/**
 * Guard de Autorização ABAC (Attribute-Based Access Control) para consulta de disputas.
 * Permite acesso total se o usuário for 'ADMIN'.
 * Permite acesso se o usuário for o Cliente ou Freelancer vinculado ao projeto da disputa.
 * Bloqueia o acesso (403 Forbidden) para qualquer outro usuário.
 */
@Injectable()
export class DisputeAccessGuard implements CanActivate {
  constructor(
    @Inject(DISPUTES_REPOSITORY)
    private readonly disputesRepository: DisputesRepository,
    
    @Inject(PROJECTS_REPOSITORY)
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
    const projectData = await this.projectsRepository.findById(dispute.projectId);
    if (!projectData) {
      throw new ProjectNotFoundException();
    }

    const project = new Project(
      projectData.id,
      projectData.clientId,
      projectData.freelancerId,
      projectData.status,
    );

    // 5. Valida se o usuário é participante direto do projeto (Lança UnauthorizedDisputeException se não for)
    project.checkUserAuthorization(user.id);

    return true;
  }
}
