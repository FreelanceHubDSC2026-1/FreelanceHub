import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { DisputeStatusEnum } from '../../../common/enums/dispute-status.enum';
import { DisputeReason } from './value-objects/dispute-reason.value-object';
import { DisputeStatus } from './value-objects/dispute-status.value-object';

export interface DomainEvent {
  dateTimeOccurred: Date;
}

export class DisputeOpenedEvent implements DomainEvent {
  public dateTimeOccurred: Date;
  constructor(public readonly projectId: string, public readonly reason: string) {
    this.dateTimeOccurred = new Date();
  }
}

@Entity('disputes')
export class Dispute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  projectId: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'enum',
    enum: DisputeStatusEnum,
    default: DisputeStatusEnum.ABERTA,
  })
  status: DisputeStatusEnum;

  @Column({ type: 'boolean', default: false })
  isPaymentBlocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  clearEvents() {
    this._domainEvents = [];
  }

  static create(projectId: string, reason: string): Dispute {
    const dispute = new Dispute();
    dispute.projectId = projectId;
    
    // Encapsulate and validate the reason using the DisputeReason Value Object
    const disputeReason = new DisputeReason(reason);
    dispute.reason = disputeReason.getValue();
    
    dispute.openDispute();
    return dispute;
  }

  openDispute() {
    this.status = DisputeStatusEnum.ABERTA;
    this.isPaymentBlocked = true;
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
    this._domainEvents.push(new DisputeOpenedEvent(this.projectId, this.reason));
  }

  get disputeReason(): DisputeReason {
    return new DisputeReason(this.reason);
  }

  get disputeStatus(): DisputeStatus {
    return new DisputeStatus(this.status);
  }
}

