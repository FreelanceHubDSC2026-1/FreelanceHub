import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../entities/project.entity';
import { ProjectsRepository } from './projects.repository.interface';

@Injectable()
export class ProjectsTypeOrmRepository implements ProjectsRepository {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repository: Repository<ProjectEntity>,
  ) {}

  async findById(projectId: string): Promise<ProjectEntity | null> {
    return await this.repository.findOne({
      where: { id: projectId },
    });
  }
}
