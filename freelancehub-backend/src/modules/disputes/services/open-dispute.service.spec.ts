import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { OpenDisputeService } from './open-dispute.service';
import { UnauthorizedDisputeException } from '../../../common/exceptions/unauthorized-dispute.exception';
import { ProjectCancelledException } from '../../../common/exceptions/project-cancelled.exception';

// Mock dependencies to completely isolate the application service from external systems
const mockProjectsRepository = {
  findById: jest.fn(),
};

const mockDisputesRepository = {
  save: jest.fn(),
  findByProjectId: jest.fn(),
};

const mockEventEmitter = {
  emit: jest.fn(),
};

const mockPaymentService = {
  blockPayment: jest.fn(),
};

// Dependency Injection Tokens following the project's strict architecture guidelines
const PROJECTS_REPOSITORY = 'PROJECTS_REPOSITORY';
const DISPUTES_REPOSITORY = 'DISPUTES_REPOSITORY';
const EVENT_EMITTER = 'EVENT_EMITTER';
const PAYMENT_SERVICE = 'PAYMENT_SERVICE';

describe('OpenDisputeService (UC13.3 - Abrir Disputa)', () => {
  let service: OpenDisputeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenDisputeService,
        {
          provide: PROJECTS_REPOSITORY,
          useValue: mockProjectsRepository,
        },
        {
          provide: DISPUTES_REPOSITORY,
          useValue: mockDisputesRepository,
        },
        {
          provide: EVENT_EMITTER,
          useValue: mockEventEmitter,
        },
        {
          provide: PAYMENT_SERVICE,
          useValue: mockPaymentService,
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn().mockImplementation(async (cb) => {
              return await cb({
                save: jest.fn().mockImplementation((entityType, entity) => {
                  const targetEntity = entity || entityType;
                  return mockDisputesRepository.save(targetEntity);
                }),
              });
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OpenDisputeService>(OpenDisputeService);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('Cliente associado ao projeto deve poder abrir disputa', async () => {
      // Setup
      const project = {
        id: 'project-123',
        clientId: 'client-abc',
        freelancerId: 'freelancer-xyz',
        status: 'IN_PROGRESS',
      };
      
      const dto = {
        projectId: 'project-123',
        userId: 'client-abc',
        reason: 'O escopo acordado não foi entregue conforme o planejado.',
      };

      const expectedDispute = {
        id: 'dispute-123',
        projectId: 'project-123',
        reason: 'O escopo acordado não foi entregue conforme o planejado.',
        status: 'ABERTA',
        isPaymentBlocked: true,
        createdAt: new Date(),
      };

      mockProjectsRepository.findById.mockResolvedValue(project);
      mockDisputesRepository.findByProjectId.mockResolvedValue(null);
      mockDisputesRepository.save.mockResolvedValue(expectedDispute);

      // Act
      const result = await service.execute(dto);

      // Assert
      expect(mockProjectsRepository.findById).toHaveBeenCalledWith(dto.projectId);
      expect(mockDisputesRepository.findByProjectId).toHaveBeenCalledWith(dto.projectId);
      expect(mockDisputesRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedDispute);
    });

    it('Freelancer associado ao projeto deve poder abrir disputa', async () => {
      // Setup
      const project = {
        id: 'project-123',
        clientId: 'client-abc',
        freelancerId: 'freelancer-xyz',
        status: 'IN_PROGRESS',
      };

      const dto = {
        projectId: 'project-123',
        userId: 'freelancer-xyz',
        reason: 'O cliente não está respondendo às mensagens para validação do projeto.',
      };

      const expectedDispute = {
        id: 'dispute-124',
        projectId: 'project-123',
        reason: 'O cliente não está respondendo às mensagens para validação do projeto.',
        status: 'ABERTA',
        isPaymentBlocked: true,
        createdAt: new Date(),
      };

      mockProjectsRepository.findById.mockResolvedValue(project);
      mockDisputesRepository.findByProjectId.mockResolvedValue(null);
      mockDisputesRepository.save.mockResolvedValue(expectedDispute);

      // Act
      const result = await service.execute(dto);

      // Assert
      expect(mockProjectsRepository.findById).toHaveBeenCalledWith(dto.projectId);
      expect(mockDisputesRepository.findByProjectId).toHaveBeenCalledWith(dto.projectId);
      expect(mockDisputesRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedDispute);
    });

    it('Usuário externo (nem cliente nem freelancer do projeto) NÃO deve poder abrir disputa e deve lançar exceção customizada', async () => {
      // Setup
      const project = {
        id: 'project-123',
        clientId: 'client-abc',
        freelancerId: 'freelancer-xyz',
        status: 'IN_PROGRESS',
      };

      const dto = {
        projectId: 'project-123',
        userId: 'external-user-777',
        reason: 'Tentativa não autorizada de gerar uma disputa.',
      };

      mockProjectsRepository.findById.mockResolvedValue(project);

      // Act & Assert
      await expect(service.execute(dto)).rejects.toThrow(UnauthorizedDisputeException);
      expect(mockDisputesRepository.save).not.toHaveBeenCalled();
    });

    it('Projeto com status "Cancelado" NÃO deve aceitar abertura de disputa e deve lançar exceção customizada', async () => {
      // Setup
      const project = {
        id: 'project-123',
        clientId: 'client-abc',
        freelancerId: 'freelancer-xyz',
        status: 'CANCELLED',
      };

      const dto = {
        projectId: 'project-123',
        userId: 'client-abc',
        reason: 'Tentativa de abrir disputa em projeto já cancelado.',
      };

      mockProjectsRepository.findById.mockResolvedValue(project);

      // Act & Assert
      await expect(service.execute(dto)).rejects.toThrow(ProjectCancelledException);
      expect(mockDisputesRepository.save).not.toHaveBeenCalled();
    });

    it('O sistema deve publicar o evento de domínio "DisputaAberta"', async () => {
      // Setup
      const project = {
        id: 'project-123',
        clientId: 'client-abc',
        freelancerId: 'freelancer-xyz',
        status: 'IN_PROGRESS',
      };

      const dto = {
        projectId: 'project-123',
        userId: 'client-abc',
        reason: 'O escopo acordado não foi entregue conforme o planejado.',
      };

      const expectedDispute = {
        id: 'dispute-123',
        projectId: 'project-123',
        reason: 'O escopo acordado não foi entregue conforme o planejado.',
        status: 'ABERTA',
        isPaymentBlocked: true,
        createdAt: new Date(),
      };

      mockProjectsRepository.findById.mockResolvedValue(project);
      mockDisputesRepository.findByProjectId.mockResolvedValue(null);
      mockDisputesRepository.save.mockResolvedValue(expectedDispute);

      // Act
      await service.execute(dto);

      // Assert
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'DisputaAberta',
        expect.objectContaining({
          projectId: 'project-123',
          reason: 'O escopo acordado não foi entregue conforme o planejado.',
        }),
      );
    });

    it('O sistema deve sinalizar o bloqueio do pagamento chamando o serviço de pagamentos', async () => {
      // Setup
      const project = {
        id: 'project-123',
        clientId: 'client-abc',
        freelancerId: 'freelancer-xyz',
        status: 'IN_PROGRESS',
      };

      const dto = {
        projectId: 'project-123',
        userId: 'client-abc',
        reason: 'O escopo acordado não foi entregue conforme o planejado.',
      };

      const expectedDispute = {
        id: 'dispute-123',
        projectId: 'project-123',
        reason: 'O escopo acordado não foi entregue conforme o planejado.',
        status: 'ABERTA',
        isPaymentBlocked: true,
        createdAt: new Date(),
      };

      mockProjectsRepository.findById.mockResolvedValue(project);
      mockDisputesRepository.findByProjectId.mockResolvedValue(null);
      mockDisputesRepository.save.mockResolvedValue(expectedDispute);

      // Act
      await service.execute(dto);

      // Assert
      expect(mockPaymentService.blockPayment).toHaveBeenCalledWith('project-123');
    });
  });
});
