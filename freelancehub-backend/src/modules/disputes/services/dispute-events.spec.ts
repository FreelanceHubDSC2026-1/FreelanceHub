import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';
import { OpenDisputeService } from './open-dispute.service';
import { Dispute } from '../entities/dispute.entity';

describe('Disparo de Eventos de Domínio e Transações - Disputes (UC13.9 - Fase RED)', () => {
  let service: OpenDisputeService;
  let dataSource: DataSource;
  let eventEmitter: any;

  // Mocks de repositório e serviços auxiliares
  const mockProjectsRepository = {
    findById: jest.fn(),
  };

  const mockDisputesRepository = {
    save: jest.fn(),
    findByProjectId: jest.fn(),
  };

  const mockPaymentService = {
    blockPayment: jest.fn(),
  };

  // Mock completo do Event Bus / Message Broker
  const mockEventEmitter = {
    emit: jest.fn(),
  };

  // Mock do gerenciador de transações do TypeORM (DataSource e EntityManager)
  const mockEntityManager = {
    save: jest.fn(),
    getRepository: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: mockEntityManager,
  };

  const mockDataSource = {
    transaction: jest.fn(),
    createQueryRunner: jest.fn(),
  };

  beforeEach(async () => {
    // Resetando todos os mocks antes de cada teste para isolamento absoluto
    jest.clearAllMocks();

    // Comportamento padrão para simular a transação do banco de dados (TypeORM)
    mockDataSource.transaction.mockImplementation(async (cb: (em: any) => Promise<any>) => {
      return await cb(mockEntityManager);
    });
    mockDataSource.createQueryRunner.mockReturnValue(mockQueryRunner);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenDisputeService,
        {
          provide: 'PROJECTS_REPOSITORY',
          useValue: mockProjectsRepository,
        },
        {
          provide: 'DISPUTES_REPOSITORY',
          useValue: mockDisputesRepository,
        },
        {
          provide: 'EVENT_EMITTER',
          useValue: mockEventEmitter,
        },
        {
          provide: 'PAYMENT_SERVICE',
          useValue: mockPaymentService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<OpenDisputeService>(OpenDisputeService);
    dataSource = module.get<DataSource>(DataSource);
    eventEmitter = module.get<any>('EVENT_EMITTER');
  });

  describe('Cenários de Publicação de Eventos sob Transação', () => {
    const projectId = '7f80db45-7975-4c6c-829d-9f4a6ebf9629';
    const userId = 'client-123';
    const reason = 'Falta de entrega do escopo acordado pelo freelancer.';

    const projectMock = {
      id: projectId,
      clientId: userId,
      freelancerId: 'freelancer-456',
      status: 'IN_PROGRESS',
    };

    const disputeMock = Dispute.create(projectId, reason);

    beforeEach(() => {
      // Configura os mocks para o fluxo feliz padrão
      mockProjectsRepository.findById.mockResolvedValue(projectMock);
      mockDisputesRepository.findByProjectId.mockResolvedValue(null);
      mockDisputesRepository.save.mockResolvedValue(disputeMock);
      mockEntityManager.save.mockResolvedValue(disputeMock);
      mockPaymentService.blockPayment.mockResolvedValue(undefined);
    });

    it('Deve publicar com sucesso o evento "DisputaAberta" quando o fluxo de abertura de disputa ocorrer sem erros', async () => {
      const emitSpy = jest.spyOn(mockEventEmitter, 'emit');

      // Executa o caso de uso
      await service.execute({ projectId, userId, reason });

      // Na fase RED, esperamos que a transação tenha sido ativada.
      // Esta asserção falhará porque o serviço de produção ainda não utiliza transações.
      expect(mockDataSource.transaction).toHaveBeenCalled();

      // Verifica se o evento 'DisputaAberta' foi publicado no barramento
      expect(emitSpy).toHaveBeenCalledWith(
        'DisputaAberta',
        expect.objectContaining({
          projectId: projectId,
          reason: reason,
        }),
      );
    });

    it('Deve publicar com sucesso o evento "PagamentoBloqueado" indicando o bloqueio financeiro originado pela disputa', async () => {
      const emitSpy = jest.spyOn(mockEventEmitter, 'emit');

      // Executa o caso de uso
      await service.execute({ projectId, userId, reason });

      // Na fase RED, esperamos que a transação tenha sido ativada.
      expect(mockDataSource.transaction).toHaveBeenCalled();

      // Esta asserção falhará na fase RED porque a lógica de produção
      // ainda não implementou o disparo do evento 'PagamentoBloqueado'.
      expect(emitSpy).toHaveBeenCalledWith(
        'PagamentoBloqueado',
        expect.objectContaining({
          projectId: projectId,
          status: 'BLOQUEADO',
        }),
      );
    });

    it('NÃO deve publicar nenhum evento se ocorrer uma falha transacional', async () => {
      const emitSpy = jest.spyOn(mockEventEmitter, 'emit');

      // Força um erro de persistência (simulando falha na transação do banco de dados)
      const dbError = new Error('Erro de persistência no banco de dados.');
      mockDisputesRepository.save.mockRejectedValue(dbError);
      mockEntityManager.save.mockRejectedValue(dbError);

      // Espera-se que a falha da transação propague o erro
      await expect(
        service.execute({ projectId, userId, reason })
      ).rejects.toThrow(dbError);

      // Garante que o gerenciador de transação foi acionado para tentar persistir e falhar
      expect(mockDataSource.transaction).toHaveBeenCalled();

      // Se a transação falhou, NENHUM evento de domínio deve ter sido publicado
      expect(emitSpy).not.toHaveBeenCalled();
      expect(emitSpy).not.toHaveBeenCalledWith('DisputaAberta', expect.any(Object));
      expect(emitSpy).not.toHaveBeenCalledWith('PagamentoBloqueado', expect.any(Object));
    });
  });
});
