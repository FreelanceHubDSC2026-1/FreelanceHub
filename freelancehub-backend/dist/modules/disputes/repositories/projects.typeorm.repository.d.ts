import { Repository } from 'typeorm';
import { ProjectEntity } from '../entities/project.entity';
import { ProjectsRepository } from './projects.repository.interface';
export declare class ProjectsTypeOrmRepository implements ProjectsRepository {
    private readonly repository;
    constructor(repository: Repository<ProjectEntity>);
    findById(projectId: string): Promise<ProjectEntity | null>;
}
