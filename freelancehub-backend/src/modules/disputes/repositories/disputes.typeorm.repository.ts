import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisputeEntity } from '../entities/dispute.entity';
import { DisputeAlreadyExistsException } from '../../../common/exceptions/dispute-already-exists.exception';
import { DisputesRepository } from './disputes.repository.interface';

@Injectable()
export class DisputesTypeOrmRepository implements DisputesRepository {
  constructor(
    @InjectRepository(DisputeEntity)
    private readonly repository: Repository<DisputeEntity>,
  ) {}

  /**
   * Persiste uma disputa no banco de dados.
   * Lida com violações de restrição de índice único do PostgreSQL (Unique Constraint)
   * mapeando o erro para a exceção de domínio correspondente.
   */
  async save(dispute: DisputeEntity): Promise<DisputeEntity> {
    try {
      return await this.repository.save(dispute);
    } catch (error: any) {
      // Código '23505' representa Unique Violation no PostgreSQL.
      // Também capturamos variações de erros de banco em memória ou SQLite se houver.
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
  }

  /**
   * Busca uma disputa pelo ID do projeto associado.
   */
  async findByProjectId(projectId: string): Promise<DisputeEntity | null> {
    return await this.repository.findOne({
      where: { projectId },
    });
  }

  /**
   * Busca uma disputa pelo seu ID único.
   */
  async findById(id: string): Promise<DisputeEntity | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }
}
