import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, CanActivate, ExecutionContext, Injectable, Module, Global, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { DisputesModule } from './disputes.module';
import { Dispute } from './entities/dispute.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DisputeStatusEnum } from '../../common/enums/dispute-status.enum';
import { OpenDisputeService } from './services/open-dispute.service';
import { DisputesService } from './services/disputes.service';

// Mocks para simulação de repositórios e serviços externos
const mockDisputesRepository = {
  findById: jest.fn(),
};

const mockProjectsRepository = {
  findById: jest.fn(),
};

@Global()
@Module({
  providers: [
    {
      provide: 'DISPUTES_REPOSITORY',
      useValue: mockDisputesRepository,
    },
    {
      provide: 'PROJECTS_REPOSITORY',
      useValue: mockProjectsRepository,
    },
    {
      provide: 'EVENT_EMITTER',
      useValue: { emit: jest.fn() },
    },
    {
      provide: 'PAYMENT_SERVICE',
      useValue: { blockPayment: jest.fn() },
    },
  ],
  exports: [
    'DISPUTES_REPOSITORY',
    'PROJECTS_REPOSITORY',
    'EVENT_EMITTER',
    'PAYMENT_SERVICE',
  ],
})
class MockExternalModule {}

/**
 * Mock da Autenticação (Guard) para os testes E2E de Autorização.
 * Simula a presença do usuário autenticado no request context com base nos headers HTTP.
 */
@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'] || request.headers['authorization'];
    
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    const role = request.headers['x-user-role'] || 'CLIENT';
    
    // Anexa as informações de autenticação (JWT Payload simulado) à requisição
    request.user = {
      id: userId,
      role: role,
    };
    
    return true;
  }
}

describe('Disputes Authorization E2E (GET /disputas/:id)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MockExternalModule, DisputesModule],
    })
      // Sobrescreve as conexões e repositórios TypeORM reais para evitar tentativas de conexão
      .overrideProvider(DataSource)
      .useValue({})
      .overrideProvider(getRepositoryToken(Dispute))
      .useValue({})
      // Sobrescreve os serviços de abertura/criação não utilizados por este teste de consulta
      .overrideProvider(OpenDisputeService)
      .useValue({})
      .overrideProvider(DisputesService)
      .useValue({})
      // Sobrescreve o repositório de disputas local para usar o mock isolado
      .overrideProvider('DISPUTES_REPOSITORY')
      .useValue(mockDisputesRepository)
      // Substitui o Guard real pelo MockAuthGuard
      .overrideGuard(JwtAuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /disputas/:id', () => {
    const disputeId = 'e2b7a0d4-722a-4db3-8f0a-fae12089b0d2';
    const projectId = '7f80db45-7975-4c6c-829d-9f4a6ebf9629';

    const mockDispute = {
      id: disputeId,
      projectId: projectId,
      reason: 'Atraso na entrega das milestones acordadas no contrato de desenvolvimento.',
      status: DisputeStatusEnum.ABERTA,
      isPaymentBlocked: true,
      createdAt: new Date().toISOString(),
    };

    const mockProject = {
      id: projectId,
      clientId: 'client-participant-111',
      freelancerId: 'freelancer-participant-222',
      status: 'IN_PROGRESS',
    };

    it('Deve permitir que o Cliente associado à disputa acesse seus detalhes com sucesso (HTTP 200)', async () => {
      // Configura os mocks para retornar os dados associados
      mockDisputesRepository.findById.mockResolvedValue(mockDispute);
      mockProjectsRepository.findById.mockResolvedValue(mockProject);

      const response = await request(app.getHttpServer())
        .get(`/disputas/${disputeId}`)
        .set('x-user-id', 'client-participant-111')
        .set('x-user-role', 'CLIENT');

      // Asserções
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(disputeId);
      expect(response.body.projectId).toBe(projectId);
      expect(response.body.reason).toBe(mockDispute.reason);
      expect(mockDisputesRepository.findById).toHaveBeenCalledWith(disputeId);
      expect(mockProjectsRepository.findById).toHaveBeenCalledWith(projectId);
    });

    it('Deve permitir que o Freelancer associado à disputa acesse seus detalhes com sucesso (HTTP 200)', async () => {
      // Configura os mocks para retornar os dados associados
      mockDisputesRepository.findById.mockResolvedValue(mockDispute);
      mockProjectsRepository.findById.mockResolvedValue(mockProject);

      const response = await request(app.getHttpServer())
        .get(`/disputas/${disputeId}`)
        .set('x-user-id', 'freelancer-participant-222')
        .set('x-user-role', 'FREELANCER');

      // Asserções
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(disputeId);
      expect(response.body.projectId).toBe(projectId);
      expect(mockDisputesRepository.findById).toHaveBeenCalledWith(disputeId);
      expect(mockProjectsRepository.findById).toHaveBeenCalledWith(projectId);
    });

    it('Deve permitir acesso total a Administradores para visualizar a disputa mesmo sem vínculo direto (HTTP 200)', async () => {
      // Configura os mocks para retornar os dados associados
      mockDisputesRepository.findById.mockResolvedValue(mockDispute);
      mockProjectsRepository.findById.mockResolvedValue(mockProject);

      const response = await request(app.getHttpServer())
        .get(`/disputas/${disputeId}`)
        .set('x-user-id', 'admin-user-999')
        .set('x-user-role', 'ADMIN');

      // Asserções
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(disputeId);
      expect(response.body.projectId).toBe(projectId);
      // Nota: Para administrador, o guard aprova imediatamente sem precisar buscar o projeto
      expect(mockDisputesRepository.findById).toHaveBeenCalledWith(disputeId);
    });

    it('Deve negar estritamente o acesso (HTTP 403 Forbidden) para Usuários Externos Autenticados (não vinculados e não admin)', async () => {
      // Configura os mocks para retornar a disputa e projeto
      mockDisputesRepository.findById.mockResolvedValue(mockDispute);
      mockProjectsRepository.findById.mockResolvedValue(mockProject);

      const response = await request(app.getHttpServer())
        .get(`/disputas/${disputeId}`)
        .set('x-user-id', 'external-user-888')
        .set('x-user-role', 'CLIENT'); // ou FREELANCER, mas sem vínculo

      // Asserções de segurança (ABAC)
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Apenas o cliente ou o freelancer associados ao projeto podem abrir uma disputa.');
    });

    it('Deve retornar HTTP 404 (Not Found) se o ID de disputa fornecido for inexistente', async () => {
      // Configura o mock de disputa para retornar null
      mockDisputesRepository.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get(`/disputas/${disputeId}`)
        .set('x-user-id', 'client-participant-111')
        .set('x-user-role', 'CLIENT');

      // Asserções
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('A disputa especificada não foi encontrada.');
    });

    it('Deve retornar HTTP 401 (Unauthorized) se a requisição não estiver autenticada', async () => {
      const response = await request(app.getHttpServer())
        .get(`/disputas/${disputeId}`);

      // Asserções do Guard de Autenticação
      expect(response.status).toBe(401);
    });
  });
});
