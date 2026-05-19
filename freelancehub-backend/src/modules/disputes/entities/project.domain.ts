import { ProjectCancelledException } from '../../../common/exceptions/project-cancelled.exception';
import { ProjectAlreadyCompletedException } from '../../../common/exceptions/project-already-completed.exception';
import { UnauthorizedDisputeException } from '../../../common/exceptions/unauthorized-dispute.exception';

export class Project {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly freelancerId: string,
    public readonly status: string,
  ) {}

  public isParticipant(userId: string): boolean {
    return userId === this.clientId || userId === this.freelancerId;
  }

  public checkDisputeEligibility(): void {
    if (this.status === 'CANCELLED' || this.status === 'Cancelado') {
      throw new ProjectCancelledException();
    }
    if (this.status === 'COMPLETED') {
      throw new ProjectAlreadyCompletedException();
    }
  }

  public checkUserAuthorization(userId: string): void {
    if (!this.isParticipant(userId)) {
      throw new UnauthorizedDisputeException();
    }
  }
}
