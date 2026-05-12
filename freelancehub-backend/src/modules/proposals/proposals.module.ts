import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProposalEntity } from "./entities/proposal.entity";
import { PROPOSALS_REPOSITORY } from "./repositories/proposals.repository.interface";
import { ProposalsService } from "./services/proposals.service";
import { ProposalsController } from "./controllers/proposals.controller";


@Module({
    imports: [
        TypeOrmModule.forFeature([ProposalEntity]),
    ],
    controllers: [ProposalsController],
    providers: [
        ProposalsService,
        {
            provide: PROPOSALS_REPOSITORY,
            useClass: ProposalEntity,
        },
    ],
    exports: [PROPOSALS_REPOSITORY, ProposalsService],
})
export class ProposalsModule { }