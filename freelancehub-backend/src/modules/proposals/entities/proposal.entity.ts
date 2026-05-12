import { ProposalStatusEnum } from "../../../common/enums/proposal-status.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('proposals')
export class ProposalEntity {
    @PrimaryGeneratedColumn('uuid',
        { name: 'proposal_id' })
    proposalId: string;

    @Column({ name: 'value' })
    value: number;

    @Column({ name: 'delivery_time' })
    deliveryTime: Date;

    @Column({ name: 'freelancer_id' })
    freelancerId: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @Column({
        type: 'enum',
        enum: ProposalStatusEnum,
        default: ProposalStatusEnum.PENDING,
    })
    status: ProposalStatusEnum;

    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;
}