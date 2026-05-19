# Infraestrutura de Banco de Dados - Migration de Disputas (UC13.6)

Este documento descreve e fornece a infraestrutura de banco de dados necessária para persistir a entidade `Dispute`. 

---

## 1. Script SQL DDL (PostgreSQL)

O script abaixo cria a tabela de disputas, estabelece a chave estrangeira (Foreign Key) apontando para a tabela de Projetos e cria um Índice Único (Unique Index) para a coluna `projectId` para garantir a nível relacional que um projeto tenha no máximo uma disputa associada.

```sql
-- Habilita extensão para geração de UUID se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criação da tabela 'disputes'
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "projectId" VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'ABERTA' NOT NULL,
    "isPaymentBlocked" BOOLEAN DEFAULT FALSE NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Chave Estrangeira vinculando à tabela de Projetos
    CONSTRAINT fk_disputes_projects FOREIGN KEY ("projectId") 
        REFERENCES projects(id) ON DELETE CASCADE
);

-- Índice Único para impedir disputas duplicadas para o mesmo projeto
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_DISPUTES_PROJECT_ID_UNIQUE" 
    ON disputes("projectId");
```

---

## 2. Classe de Migration do TypeORM (TypeScript)

Para projetos que utilizam a CLI do TypeORM para rodar migrations de forma programática, utilize a seguinte classe:

```typescript
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateDisputesTable1715918000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "disputes",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "projectId",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "reason",
                        type: "text",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        default: "'ABERTA'",
                        isNullable: false,
                    },
                    {
                        name: "isPaymentBlocked",
                        type: "boolean",
                        default: false,
                        isNullable: false,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        // Chave estrangeira ligando à tabela de projetos
        await queryRunner.createForeignKey(
            "disputes",
            new TableForeignKey({
                columnNames: ["projectId"],
                referencedColumnNames: ["id"],
                referencedTableName: "projects",
                onDelete: "CASCADE",
            })
        );

        // Índice único para impedir inserção duplicada para o mesmo projeto
        await queryRunner.createIndex(
            "disputes",
            new TableIndex({
                name: "IDX_DISPUTES_PROJECT_ID_UNIQUE",
                columnNames: ["projectId"],
                isUnique: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove o índice e a foreign key são removidos automaticamente ao excluir a tabela
        await queryRunner.dropTable("disputes");
    }
}
```
