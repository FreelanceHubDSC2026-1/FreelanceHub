import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Dispute } from '../entities/dispute.entity';
import { UnauthorizedDisputeException } from '../../../common/exceptions/unauthorized-dispute.exception';
import { ProjectCancelledException } from '../../../common/exceptions/project-cancelled.exception';
import { ProjectNotFoundException } from '../../../common/exceptions/project-not-found.exception';
import { DisputeAlreadyExistsException } from '../../../common/exceptions/dispute-already-exists.exception';

export interface OpenDisputeDto {
  projectId: string;
  userId: string;
  reason: string;
}

// Architectural interfaces representing ports for our application layer
export interface ProjectsRepository {
  findById(projectId: string): Promise<{
    id: string;
    clientId: string;
    freelancerId: string;
    status: string;
  } | null>;
}

export interface DisputesRepository {
  save(dispute: Dispute): Promise<Dispute>;
  findByProjectId(projectId: string): Promise<Dispute | null>;
  findById(id: string): Promise<Dispute | null>;
}

export interface EventEmitter {
  emit(event: string, data: any): void;
}

export interface PaymentService {
  blockPayment(projectId: string): Promise<void>;
}

@Injectable()
export class OpenDisputeService {
  constructor(
    @Inject('PROJECTS_REPOSITORY')
    private readonly projectsRepository: ProjectsRepository,
    
    @Inject('DISPUTES_REPOSITORY')
    private readonly disputesRepository: DisputesRepository,
    
    @Inject('EVENT_EMITTER')
    private readonly eventEmitter: EventEmitter,
    
    @Inject('PAYMENT_SERVICE')
    private readonly paymentService: PaymentService,

    private readonly dataSource: DataSource,
  ) {}

  async execute(dto: OpenDisputeDto): Promise<Dispute> {
    // 1. Buscar Projeto pelo ID utilizando o repositório
    const project = await this.projectsRepository.findById(dto.projectId);
    if (!project) {
      throw new ProjectNotFoundException();
    }

    // 2. Estado do Projeto (Se cancelado, lança exceção customizada de domínio)
    if (project.status === 'CANCELLED' || project.status === 'Cancelado') {
      throw new ProjectCancelledException();
    }

    // 3. Validar Permissões (Somente o Cliente ou o Freelancer associados ao projeto podem abrir disputa)
    if (dto.userId !== project.clientId && dto.userId !== project.freelancerId) {
      throw new UnauthorizedDisputeException();
    }

    // 4. Verificar se já existe uma disputa para este projeto (Regra da UC13.2)
    const existingDispute = await this.disputesRepository.findByProjectId(dto.projectId);
    if (existingDispute) {
      throw new DisputeAlreadyExistsException();
    }

    let savedDispute: Dispute;

    // 5. Executar fluxo de persistência de forma transacional usando o DataSource do TypeORM
    await this.dataSource.transaction(async (entityManager) => {
      // Instanciar a Entidade Disputa
      const dispute = Dispute.create(dto.projectId, dto.reason);

      // Persistir no banco de dados dentro do escopo transacional
      try {
        savedDispute = await entityManager.save(Dispute, dispute);
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
      await this.paymentService.blockPayment(dto.projectId);
    });

    const occurredAt = new Date();

    // 7. Publicar evento de domínio DisputaAberta (só após o sucesso do commit da transação)
    this.eventEmitter.emit('DisputaAberta', {
      disputeId: savedDispute!.id,
      projectId: savedDispute!.projectId,
      userId: dto.userId,
      reason: savedDispute!.reason,
      occurredAt,
    });

    // 8. Publicar evento de domínio PagamentoBloqueado (só após o sucesso do commit da transação)
    this.eventEmitter.emit('PagamentoBloqueado', {
      disputeId: savedDispute!.id,
      projectId: savedDispute!.projectId,
      userId: dto.userId,
      status: 'BLOQUEADO',
      occurredAt,
    });

    return savedDispute!;
  }
}
