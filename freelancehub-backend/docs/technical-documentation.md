# FreelanceHub Backend - Technical Documentation


## 1. Visão Geral e Stack Tecnológico

O backend do FreelanceHub é construído com as seguintes tecnologias principais:
- **Framework Principal:** NestJS (Node.js)
- **Linguagem:** TypeScript
- **ORM & Banco de Dados:** TypeORM com PostgreSQL (pg)
- **Testes:** Jest
- **Qualidade de Código:** ESLint e Prettier
- **Gerenciador de Pacotes:** pnpm (em um ambiente de monorepo)

## 2. Arquitetura e Estrutura

O projeto segue a arquitetura orientada a domínios (Domain-Driven Design - DDD), onde os arquivos são agrupados em módulos coesos que representam contextos de negócio, localizados dentro de `src/modules/`.

### O Padrão de Repositórios (Repository Pattern)
A comunicação com o banco de dados e persistência é abstraída através do Repository Pattern para facilitar testes e desacoplamento.
- **Interfaces (`*.repository.interface.ts`):** Definem os contratos de acesso a dados (ex: `ProposalsRepository`). Nenhuma lógica de framework de banco de dados (como importações do TypeORM) vaza para os serviços de domínio.
- **Implementações:** As implementações concretas assinam a interface e utilizam o TypeORM (ou outro ORM) para realizar as consultas reais no banco de dados.

## 3. Modelagem de Domínio e Regras de Negócio

### Entidades Atuais
- **Proposal (`ProposalEntity`):** Representa a proposta de um freelancer para um projeto. Contém o valor (`value`), tempo de entrega (`deliveryTime`), status da proposta (pendente, confirmada, etc.), além dos identificadores de projeto e freelancer.
- **Dispute (em andamento):** O domínio de disputas, envolvendo bloqueio de pagamentos de projetos, está sendo modelado de acordo com as regras de fluxo (observado via Testes Unitários de entidade que iniciam o comportamento).

### Casos de Uso e Regras de Negócio
- **Confirmar Proposta (`confirmProposal`):** O fluxo principal implementado.
  - *Validação:* Busca a proposta pelo ID. Se não existir, lança uma exceção customizada de domínio.
  - *Ação:* Atualiza os metadados da proposta, como data de atualização, e a persiste via repositório. Retorna um DTO (Data Transfer Object) com as informações confirmadas de domínio.

## 4. Padrões e Guidelines (CRÍTICO)

A não observância das diretrizes abaixo resultará em rejeição imediata do Pull Request ou revisão da contribuição do agente.

### 4.1 Injeção de Dependência via Tokens
As dependências, especialmente os Repositórios, NUNCA devem ser injetadas pela sua classe concreta. Deve-se **sempre** utilizar Tokens de Injeção (Constantes ou Symbols).
- **Definição:** Exemplo: `export const PROPOSALS_REPOSITORY = 'PROPOSALS_REPOSITORY';`
- **Uso no Serviço:**
  ```typescript
  import { Inject, Injectable } from "@nestjs/common";
  import { PROPOSALS_REPOSITORY, ProposalsRepository } from "../repositories/proposals.repository.interface";

  @Injectable()
  export class ProposalsService {
      constructor(
          @Inject(PROPOSALS_REPOSITORY)
          private readonly proposalsRepository: ProposalsRepository,
      ) {}
  }
  ```

### 4.2 Exceções de Domínio Customizadas
Todo e qualquer fluxo de erro relacionado a regras de negócio deve ser tratado com Exceções Customizadas.
- O projeto centraliza exceções (ex: em `src/common/exceptions/`).
- As exceções estendem os erros apropriados do NestJS para facilitar a resposta HTTP amigável (ex: `NotFoundException`, `BadRequestException`).
- **Exemplo:** `ProposalNotFoundException` estendendo `NotFoundException`. Nenhuma string genérica de erro deve ser lançada diretamente de um service usando o objeto nativo `throw new Error(...)`.

> [!CAUTION]
> ### 4.3 MANDATÓRIO: Test-Driven Development (TDD)
> O desenvolvimento guiado por testes (TDD) é **innegociável e absolutamente obrigatório** neste projeto. Nenhum código de produção (`*.ts`) ou refatoração deve ser iniciada sem a existência prévia de testes.
>
> **O ciclo OBRIGATÓRIO (Red-Green-Refactor):**
> 1. **RED:** Escreva o teste unitário (`*.spec.ts`) que cubra a regra de negócio ANTES da implementação. Execute o teste e garanta que ele **falha**.
> 2. **GREEN:** Implemente o mínimo de código de produção necessário para fazer o teste passar.
> 3. **REFACTOR:** Refatore a implementação para seguir as melhores práticas e guidelines arquiteturais descritos acima, mantendo os testes verdes.
>
> Os testes definem os requisitos de negócio (ex: *"Deve bloquear o fluxo de pagamento associado ao projeto"*). **Qualquer IA ou desenvolvedor que alterar ou gerar lógica de produção antes de gerar os testes correspondentes estará violando o guideline principal do projeto.**
