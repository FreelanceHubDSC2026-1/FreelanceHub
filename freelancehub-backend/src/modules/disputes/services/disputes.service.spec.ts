import { Test, TestingModule } from '@nestjs/testing';
import { DisputesService } from './disputes.service';
import { ProjectAlreadyCompletedException } from '../../../common/exceptions/project-already-completed.exception';
import { DisputeAlreadyExistsException } from '../../../common/exceptions/dispute-already-exists.exception';
import { DisputeStatusEnum } from '../../../common/enums/dispute-status.enum';

// Mocks para simular dependências e isolar o domínio puro (sem banco de dados real)
const mockDisputesRepository = {
  findByProjectId: jest.fn(),
  save: jest.fn(),
};

const mockProjectsRepository = {
  findById: jest.fn(),
};

// Tokens que seguem o padrão arquitetural definido
const DISPUTES_REPOSITORY = 'DISPUTES_REPOSITORY';
const PROJECTS_REPOSITORY = 'PROJECTS_REPOSITORY';

describe('DisputesService (Domain Rules)', () => {
  let service: DisputesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisputesService,
        {
          provide: DISPUTES_REPOSITORY,
          useValue: mockDisputesRepository,
        },
        {
          provide: PROJECTS_REPOSITORY,
          useValue: mockProjectsRepository,
        },
      ],
    }).compile();

    service = module.get<DisputesService>(DisputesService);

    jest.clearAllMocks();
  });

  describe('createDispute', () => {
    it('Deve criar a disputa com o status inicial ABERTA', async () => {
      // Setup: Projeto válido e sem disputas abertas
      mockProjectsRepository.findById.mockResolvedValue({ id: 'project-1', status: 'IN_PROGRESS' });
      mockDisputesRepository.findByProjectId.mockResolvedValue(null);
      mockDisputesRepository.save.mockImplementation((dispute: any) => Promise.resolve({ ...dispute, id: 'dispute-1' }));

      const result = await service.createDispute({
        projectId: 'project-1',
        reason: 'Entrega não condiz com o escopo acordado',
      });

      expect(result).toBeDefined();
      expect(result.status).toBe(DisputeStatusEnum.ABERTA);
    });

    it('Deve registrar a data de criação (createdAt instanciado)', async () => {
      mockProjectsRepository.findById.mockResolvedValue({ id: 'project-1', status: 'IN_PROGRESS' });
      mockDisputesRepository.findByProjectId.mockResolvedValue(null);
      mockDisputesRepository.save.mockImplementation((dispute: any) => Promise.resolve({ ...dispute, id: 'dispute-2' }));

      const result = await service.createDispute({
        projectId: 'project-1',
        reason: 'Falta de comunicação com o cliente',
      });

      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('Não deve permitir abertura se o projeto estiver concluído', async () => {
      // Setup: Simular um projeto já finalizado
      mockProjectsRepository.findById.mockResolvedValue({ id: 'project-completed', status: 'COMPLETED' });

      await expect(
        service.createDispute({
          projectId: 'project-completed',
          reason: 'Tentativa de disputa tardia',
        })
      ).rejects.toThrow(ProjectAlreadyCompletedException);
    });

    it('Não deve permitir disputa duplicada para o mesmo projeto', async () => {
      // Setup: Projeto válido, mas com disputa já existente
      mockProjectsRepository.findById.mockResolvedValue({ id: 'project-1', status: 'IN_PROGRESS' });
      mockDisputesRepository.findByProjectId.mockResolvedValue({ id: 'existing-dispute', status: DisputeStatusEnum.ABERTA });

      await expect(
        service.createDispute({
          projectId: 'project-1',
          reason: 'Nova tentativa de disputa para o mesmo projeto',
        })
      ).rejects.toThrow(DisputeAlreadyExistsException);
    });

    it('Deve sinalizar o bloqueio do pagamento associado', async () => {
      mockProjectsRepository.findById.mockResolvedValue({ id: 'project-1', status: 'IN_PROGRESS' });
      mockDisputesRepository.findByProjectId.mockResolvedValue(null);

      let savedDispute: any;
      mockDisputesRepository.save.mockImplementation((dispute: any) => {
        savedDispute = dispute;
        return Promise.resolve({ ...dispute, id: 'dispute-3' });
      });

      const result = await service.createDispute({
        projectId: 'project-1',
        reason: 'Disputa financeira',
      });

      // Validações
      expect(result.isPaymentBlocked).toBe(true);
      expect(savedDispute.isPaymentBlocked).toBe(true);
    });
  });
});
