export declare const PROJECTS_REPOSITORY = "PROJECTS_REPOSITORY";
export interface ProjectsRepository {
    findById(projectId: string): Promise<{
        id: string;
        clientId: string;
        freelancerId: string;
        status: string;
    } | null>;
}
