import { CanActivate, ExecutionContext } from '@nestjs/common';
import { DisputesRepository } from '../../modules/disputes/repositories/disputes.repository.interface';
import { ProjectsRepository } from '../../modules/disputes/repositories/projects.repository.interface';
export declare class DisputeAccessGuard implements CanActivate {
    private readonly disputesRepository;
    private readonly projectsRepository;
    constructor(disputesRepository: DisputesRepository, projectsRepository: ProjectsRepository);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
