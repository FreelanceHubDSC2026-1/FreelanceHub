import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProjectEntity } from './modules/disputes/entities/project.entity';
import { DisputeEntity } from './modules/disputes/entities/dispute.entity';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onApplicationBootstrap() {
    console.log('[Seeder] Starting database seeding for TDD scenarios...');
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
      // Limpa disputas antigas para permitir que os testes rodem limpos
      await queryRunner.manager.createQueryBuilder().delete().from(DisputeEntity).execute();
      console.log('[Seeder] Cleared previous disputes to reset test state.');

      // 1. Seed eligible project
      const eligibleProjectId = '7f80db45-7975-4c6c-829d-9f4a6ebf9629';
      let eligibleProject = await queryRunner.manager.findOne(ProjectEntity, { where: { id: eligibleProjectId } });
      if (!eligibleProject) {
        eligibleProject = queryRunner.manager.create(ProjectEntity, {
          id: eligibleProjectId,
          clientId: 'client-participant-111',
          freelancerId: 'freelancer-participant-222',
          status: 'IN_PROGRESS',
        });
        await queryRunner.manager.save(ProjectEntity, eligibleProject);
        console.log(`[Seeder] Seeded project ${eligibleProjectId} (IN_PROGRESS)`);
      }

      // 2. Seed cancelled project
      const cancelledProjectId = '9c90db45-7975-4c6c-829d-9f4a6ebf9629';
      let cancelledProject = await queryRunner.manager.findOne(ProjectEntity, { where: { id: cancelledProjectId } });
      if (!cancelledProject) {
        cancelledProject = queryRunner.manager.create(ProjectEntity, {
          id: cancelledProjectId,
          clientId: 'client-participant-111',
          freelancerId: 'freelancer-participant-222',
          status: 'CANCELLED',
        });
        await queryRunner.manager.save(ProjectEntity, cancelledProject);
        console.log(`[Seeder] Seeded project ${cancelledProjectId} (CANCELLED)`);
      }
      
      console.log('[Seeder] Seeding finished successfully.');
    } catch (err) {
      console.error('[Seeder] Error during database seeding:', err);
    } finally {
      await queryRunner.release();
    }
  }
}