import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('projects')
export class ProjectEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  clientId: string;

  @Column({ type: 'varchar' })
  freelancerId: string;

  @Column({ type: 'varchar', default: 'IN_PROGRESS' })
  status: string;
}
