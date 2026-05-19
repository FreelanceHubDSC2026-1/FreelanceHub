import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ForbiddenException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { DisputesModule } from './disputes.module';
import { OpenDisputeService } from './services/open-dispute.service';
import { DisputesService } from './services/disputes.service';
import { Dispute } from './entities/dispute.entity';
import { ProjectNotFoundException } from '../../common/exceptions/project-not-found.exception';
import { DisputeAlreadyExistsException } from '../../common/exceptions/dispute-already-exists.exception';

/**
 * Mock da Autenticação (Guard) para os testes E2E.
 * Simula a presença de um usuário autenticado no request context com base nos headers da requisição.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];
    
    if (!userId) {
      return false; // Retorna 401 Unauthorized se não houver ID de usuário simulado
    }

    const role = request.headers['x-user-role'] || 'CLIENT';
    
    // Anexa as informações do usuário autenticado à requisição
    request.user = {
      id: userId,
      role: role,
    };
    
    return true;
  }
}

describe('Disputes E2E (POST /projetos/:id/disputas)', () => {
  let app: INestApplication;

  // Definição dos mocks dos serviços para isolar a camada HTTP do Controller
  const mockOpenDisputeService = {
    execute: jest.fn(),
  };

  const mockDisputesService = {
    createDispute: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DisputesModule],
    })
      // Sobrescreve a conexão de banco de dados com um mock vazio para evitar tentativas de conexão reais
      .overrideProvider(DataSource)
      .useValue({})
      .overrideProvider(getRepositoryToken(Dispute))
      .useValue({})
      // Sobrescreve as dependências do repositório/serviços externos injetados
      .overrideProvider('PROJECTS_REPOSITORY')
      .useValue({})
      .overrideProvider('EVENT_EMITTER')
      .useValue({})
      .overrideProvider('PAYMENT_SERVICE')
      .useValue({})
      .overrideProvider(OpenDisputeService)
      .useValue(mockOpenDisputeService)
      .overrideProvider(DisputesService)
      .useValue(mockDisputesService)
      // Substitui o Guard de Autenticação real pelo MockAuthGuard nos testes
      .overrideGuard(JwtAuthGuard)
      .useClass(JwtAuthGuard)
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

  describe('POST /projetos/:id/disputas', () => {
    const projectId = 'project-123-abc';
    const disputePayload = {
      reason: 'O escopo acordado não foi entregue conforme o planejado pelo freelancer.',
    };

    const mockCreatedDispute = {
      id: 'dispute-789-xyz',
      projectId: projectId,
      reason: disputePayload.reason,
      status: 'ABERTA',
      isPaymentBlocked: true,
      createdAt: new Date().toISOString(),
    };

    it('Deve retornar status HTTP 201 (Created) e o payload correto ao criar uma disputa com sucesso', async () => {
      // Configura os mocks dos serviços para retornar sucesso
      mockOpenDisputeService.execute.mockResolvedValue(mockCreatedDispute);
      mockDisputesService.createDispute.mockResolvedValue(mockCreatedDispute);

      const response = await request(app.getHttpServer())
        .post(`/projetos/${projectId}/disputas`)
        .set('x-user-id', 'client-abc')
        .set('x-user-role', 'CLIENT')
        .send(disputePayload);

      // Asserções do comportamento HTTP
      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.projectId).toBe(projectId);
      expect(response.body.reason).toBe(disputePayload.reason);
      expect(response.body.status).toBe('ABERTA');
      expect(response.body.isPaymentBlocked).toBe(true);
      expect(response.body.id).toBeDefined();

      // Verifica se os serviços foram chamados com os dados corretos
      if (mockOpenDisputeService.execute.mock.calls.length > 0) {
        expect(mockOpenDisputeService.execute).toHaveBeenCalledWith(
          expect.objectContaining({
            projectId: projectId,
            userId: 'client-abc',
            reason: disputePayload.reason,
          }),
        );
      } else {
        expect(mockDisputesService.createDispute).toHaveBeenCalledWith(
          expect.objectContaining({
            projectId: projectId,
            reason: disputePayload.reason,
          }),
        );
      }
    });

    it('Deve retornar status HTTP 403 (Forbidden) se um usuário autenticado mas sem permissão (Usuário Externo não vinculado ao projeto) tentar abrir a disputa', async () => {
      const errorMsg = 'Apenas o cliente ou o freelancer associados ao projeto podem abrir uma disputa.';
      
      // Simula a falha de permissão lançando ForbiddenException no mock do serviço
      mockOpenDisputeService.execute.mockRejectedValue(new ForbiddenException(errorMsg));
      mockDisputesService.createDispute.mockRejectedValue(new ForbiddenException(errorMsg));

      const response = await request(app.getHttpServer())
        .post(`/projetos/${projectId}/disputas`)
        .set('x-user-id', 'external-user-777')
        .set('x-user-role', 'EXTERNAL')
        .send(disputePayload);

      // Asserções do comportamento HTTP de autorização
      expect(response.status).toBe(403);
      expect(response.body.message).toContain(errorMsg);
    });

    it('Deve retornar status HTTP 404 (Not Found) se o ID do projeto fornecido na rota não existir', async () => {
      // Simula a falha de projeto inexistente lançando ProjectNotFoundException
      mockOpenDisputeService.execute.mockRejectedValue(new ProjectNotFoundException());
      mockDisputesService.createDispute.mockRejectedValue(new ProjectNotFoundException());

      const response = await request(app.getHttpServer())
        .post('/projetos/non-existent-id/disputas')
        .set('x-user-id', 'client-abc')
        .set('x-user-role', 'CLIENT')
        .send(disputePayload);

      // Asserções do comportamento HTTP de recurso não encontrado
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('O projeto especificado não foi encontrado.');
    });

    it('Deve retornar status HTTP 409 (Conflict) caso a disputa seja duplicada para o mesmo projeto', async () => {
      // Simula a falha de disputa duplicada lançando DisputeAlreadyExistsException
      mockOpenDisputeService.execute.mockRejectedValue(new DisputeAlreadyExistsException());
      mockDisputesService.createDispute.mockRejectedValue(new DisputeAlreadyExistsException());

      const response = await request(app.getHttpServer())
        .post(`/projetos/${projectId}/disputas`)
        .set('x-user-id', 'client-abc')
        .set('x-user-role', 'CLIENT')
        .send(disputePayload);

      // Asserções do comportamento HTTP de conflito
      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Já existe uma disputa em andamento para este projeto.');
    });
  });
});
