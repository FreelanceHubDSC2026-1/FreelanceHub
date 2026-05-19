import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Dispute } from '../entities/dispute.entity';
import { DisputesTypeOrmRepository } from './disputes.typeorm.repository';
import { DisputeStatusEnum } from '../../../common/enums/dispute-status.enum';

describe('DisputesTypeOrmRepository (Integration - RED Phase)', () => {
  let repository: DisputesTypeOrmRepository;
  let module: TestingModule;
  let dataSource: DataSource;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        // Estratégia de Banco de Dados Isolado para Testes de Integração
        // Para garantir fidelidade máxima com o ambiente de produção (PostgreSQL),
        // configuramos uma conexão dedicada de teste. É possível configurar variáveis de ambiente
        // específicas ou usar fallbacks locais dedicados a testes com dropSchema ativado.
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST_TEST || 'localhost',
          port: Number(process.env.DB_PORT_TEST) || 5432,
          username: process.env.DB_USERNAME_TEST || 'FreelanceHub',
          password: process.env.DB_PASSWORD_TEST || 'example_password',
          database: process.env.DB_DATABASE_TEST || 'FreelanceHub_db',
          entities: [Dispute],
          synchronize: true, // Cria e atualiza tabelas automaticamente no banco isolado de teste
          dropSchema: true,  // Limpa todo o esquema do banco antes do carregamento dos testes
          logging: false,
        }),
        TypeOrmModule.forFeature([Dispute]),
      ],
      providers: [
        DisputesTypeOrmRepository,
      ],
    }).compile();

    repository = module.get<DisputesTypeOrmRepository>(DisputesTypeOrmRepository);
    dataSource = module.get<DataSource>(DataSource);

    // Garante que a tabela comece limpa antes de cada caso de teste
    await dataSource.getRepository(Dispute).clear();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  // Cenário 1: Deve salvar uma disputa corretamente no banco de dados e retornar a entidade com ID gerado (UUID) e os timestamps (createdAt).
  it('Deve salvar uma disputa corretamente no banco de dados e retornar a entidade com ID gerado (UUID) e os timestamps (createdAt)', async () => {
    const projectId = '7f80db45-7975-4c6c-829d-9f4a6ebf9629';
    const reason = 'O freelancer não entregou o escopo conforme acordado dentro do prazo.';
    
    // Instancia a entidade de domínio através da factory estática
    const dispute = Dispute.create(projectId, reason);
    
    // Persiste no banco de dados através do repositório
    const savedDispute = await repository.save(dispute);
    
    // Asserções
    expect(savedDispute).toBeDefined();
    expect(savedDispute.id).toBeDefined();
    // Valida se o ID gerado segue o formato padrão de UUID (v4)
    expect(savedDispute.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    expect(savedDispute.projectId).toBe(projectId);
    expect(savedDispute.reason).toBe(reason);
    expect(savedDispute.status).toBe(DisputeStatusEnum.ABERTA);
    expect(savedDispute.createdAt).toBeInstanceOf(Date);

    // Validação de persistência física (busca direta no banco de dados)
    const persisted = await dataSource
      .getRepository(Dispute)
      .findOne({ where: { id: savedDispute.id } });
    
    expect(persisted).toBeDefined();
    expect(persisted?.projectId).toBe(projectId);
    expect(persisted?.status).toBe(DisputeStatusEnum.ABERTA);
  });

  // Cenário 2: Deve buscar uma disputa ativa filtrando pelo ID do projeto associado.
  it('Deve buscar uma disputa ativa filtrando pelo ID do projeto associado', async () => {
    const projectId = '815c43d9-95e5-47eb-ba6a-cce6b4c9e421';
    const reason = 'Ausência de comunicação por parte do cliente após o pagamento de garantia.';
    
    // Insere a disputa diretamente usando o DataSource para preparar o cenário do teste
    const dispute = Dispute.create(projectId, reason);
    await dataSource.getRepository(Dispute).save(dispute);
    
    // Executa a busca utilizando o método a ser implementado no repositório
    const foundDispute = await repository.findByProjectId(projectId);
    
    // Asserções
    expect(foundDispute).not.toBeNull();
    expect(foundDispute).toBeDefined();
    expect(foundDispute?.projectId).toBe(projectId);
    expect(foundDispute?.status).toBe(DisputeStatusEnum.ABERTA);
  });

  // Cenário 3: Deve impedir a inserção de uma disputa duplicada para o mesmo projeto (lançando uma restrição/exceção de banco de dados ou erro mapeado pelo repositório).
  it('Deve impedir a inserção de uma disputa duplicada para o mesmo projeto (lançando uma restrição/exceção de banco de dados ou erro mapeado pelo repositório)', async () => {
    const projectId = 'd3b07384-d113-4c91-a5b6-70e176378415';
    
    const dispute1 = Dispute.create(projectId, 'Primeira reclamação de escopo.');
    const dispute2 = Dispute.create(projectId, 'Segunda reclamação paralela de escopo.');
    
    // Salva a primeira disputa com sucesso
    await repository.save(dispute1);
    
    // Tenta salvar a segunda disputa para o mesmo projeto - deve falhar e lançar uma exceção de restrição
    await expect(repository.save(dispute2)).rejects.toThrow();
  });

  // Cenário 4: Deve listar corretamente todas as disputas que possuem o status 'ABERTA'.
  it('Deve listar corretamente todas as disputas que possuem o status ABERTA', async () => {
    const projectOpen1 = 'a0d3bf41-6927-4a0b-8519-cbfbf992e591';
    const projectOpen2 = 'b6d21e84-17a4-4a49-9c59-bf73a4bbf882';
    const projectClosed = 'c123ea39-25e2-4752-9442-8356d7732df3';
    
    const disputeOpen1 = Dispute.create(projectOpen1, 'Motivo Aberto 1'); // Status: 'ABERTA' por padrão
    const disputeOpen2 = Dispute.create(projectOpen2, 'Motivo Aberto 2'); // Status: 'ABERTA' por padrão
    
    const disputeClosed = Dispute.create(projectClosed, 'Motivo Encerrado');
    disputeClosed.status = DisputeStatusEnum.FECHADA; // Força um status diferente de 'ABERTA'
    
    // Prepara os dados inserindo-os em lote no banco
    await dataSource.getRepository(Dispute).save([disputeOpen1, disputeOpen2, disputeClosed]);
    
    // Executa a listagem com o método a ser implementado no repositório
    const openDisputes = await repository.findOpenDisputes();
    
    // Asserções
    expect(openDisputes).toBeDefined();
    expect(openDisputes).toBeInstanceOf(Array);
    expect(openDisputes.length).toBe(2);
    
    // Verifica se os projetos com disputas ativas estão presentes na listagem
    const projectIds = openDisputes.map(d => d.projectId);
    expect(projectIds).toContain(projectOpen1);
    expect(projectIds).toContain(projectOpen2);
    expect(projectIds).not.toContain(projectClosed);
    
    // Garante que todas as disputas retornadas possuem de fato o status 'ABERTA'
    openDisputes.forEach(d => {
      expect(d.status).toBe(DisputeStatusEnum.ABERTA);
    });
  });
});
