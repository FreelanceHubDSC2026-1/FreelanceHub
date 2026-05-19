import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DisputeEntity } from '../entities/dispute.entity';
import { Project } from '../entities/project.domain';
import { ProjectNotFoundException } from '../../../common/exceptions/project-not-found.exception';
import { DisputeAlreadyExistsException } from '../../../common/exceptions/dispute-already-exists.exception';
import { DISPUTES_REPOSITORY, DisputesRepository } from '../repositories/disputes.repository.interface';
import { PROJECTS_REPOSITORY, ProjectsRepository } from '../repositories/projects.repository.interface';
import { EVENT_EMITTER, PAYMENT_SERVICE, EventEmitter, PaymentService } from './infrastructure-mocks';

export interface CreateDisputeCommand {
  projectId: string;
  userId: string;
  reason: string;
}

@Injectable()
export class DisputesService {
  constructor(
    @Inject(PROJECTS_REPOSITORY)
    private readonly projectsRepository: ProjectsRepository,
    
    @Inject(DISPUTES_REPOSITORY)
    private readonly disputesRepository: DisputesRepository,
    
    @Inject(EVENT_EMITTER)
    private readonly eventEmitter: EventEmitter,
    
    @Inject(PAYMENT_SERVICE)
    private readonly paymentService: PaymentService,

    private readonly dataSource: DataSource,
  ) {}

  async createDispute(command: CreateDisputeCommand): Promise<DisputeEntity> {
    // 1. Buscar Projeto pelo ID utilizando o repositório
    const projectData = await this.projectsRepository.findById(command.projectId);
    if (!projectData) {
      throw new ProjectNotFoundException();
    }

    // Instanciar o modelo de domínio do Projeto
    const project = new Project(
      projectData.id,
      projectData.clientId,
      projectData.freelancerId,
      projectData.status,
    );

    // 2. Estado do Projeto (Se cancelado, lança exceção customizada de domínio)
    project.checkDisputeEligibility();

    // 3. Validar Permissões (Somente o Cliente ou o Freelancer associados ao projeto podem abrir disputa)
    project.checkUserAuthorization(command.userId);

    // 4. Verificar se já existe uma disputa para este projeto
    const existingDispute = await this.disputesRepository.findByProjectId(command.projectId);
    if (existingDispute) {
      throw new DisputeAlreadyExistsException();
    }

    let savedDispute: DisputeEntity;

    // 5. Executar fluxo de persistência de forma transacional usando o DataSource do TypeORM
    await this.dataSource.transaction(async (entityManager) => {
      // Instanciar a Entidade Disputa
      const dispute = DisputeEntity.create(command.projectId, command.reason);

      // Persistir no banco de dados dentro do escopo transacional
      try {
        savedDispute = await entityManager.save(DisputeEntity, dispute);
      } catch (error: any) {
        // Mapeia violações de unicidade no banco de dados
        const isUniqueViolation = 
          error?.code === '23505' || 
          error?.message?.includes('unique constraint') || 
          error?.message?.includes('duplicate key') ||
          error?.message?.includes('UNIQUE constraint failed');

        if (isUniqueViolation) {
          throw new DisputeAlreadyExistsException();
        }
        throw error;
      }

      // 6. Bloquear fluxo de pagamento associado chamando o serviço de pagamentos
      await this.paymentService.blockPayment(command.projectId);
    });

    const occurredAt = new Date();

    // 7. Publicar evento de domínio DisputaAberta (só após o sucesso do commit da transação - Post-Commit Pattern)
    this.eventEmitter.emit('DisputaAberta', {
      disputeId: savedDispute!.id,
      projectId: savedDispute!.projectId,
      userId: command.userId,
      reason: savedDispute!.reason,
      occurredAt,
    });

    // 8. Publicar evento de domínio PagamentoBloqueado (só após o sucesso do commit da transação)
    this.eventEmitter.emit('PagamentoBloqueado', {
      disputeId: savedDispute!.id,
      projectId: savedDispute!.projectId,
      userId: command.userId,
      status: 'BLOQUEADO',
      occurredAt,
    });

    return savedDispute!;
  }
}
