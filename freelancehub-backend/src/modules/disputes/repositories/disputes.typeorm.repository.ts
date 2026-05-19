import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispute } from '../entities/dispute.entity';
import { DisputeStatusEnum } from '../../../common/enums/dispute-status.enum';
import { DisputeAlreadyExistsException } from '../../../common/exceptions/dispute-already-exists.exception';
import { DisputesRepository } from '../services/open-dispute.service';

@Injectable()
export class DisputesTypeOrmRepository implements DisputesRepository {
  constructor(
    @InjectRepository(Dispute)
    private readonly repository: Repository<Dispute>,
  ) {}

  /**
   * Persiste uma disputa no banco de dados.
   * Lida com violações de restrição de índice único do PostgreSQL (Unique Constraint)
   * mapeando o erro para a exceção de domínio correspondente.
   */
  async save(dispute: Dispute): Promise<Dispute> {
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
  async findByProjectId(projectId: string): Promise<Dispute | null> {
    return await this.repository.findOne({
      where: { projectId },
    });
  }

  /**
   * Lista todas as disputas que possuem o status 'ABERTA'.
   */
  async findOpenDisputes(): Promise<Dispute[]> {
    return await this.repository.find({
      where: { status: DisputeStatusEnum.ABERTA },
    });
  }
}
