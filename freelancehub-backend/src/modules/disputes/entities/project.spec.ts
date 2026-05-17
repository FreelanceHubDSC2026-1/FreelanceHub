import { Project } from './project.domain';
import { ProjectCancelledException } from '../../../common/exceptions/project-cancelled.exception';
import { ProjectAlreadyCompletedException } from '../../../common/exceptions/project-already-completed.exception';
import { UnauthorizedDisputeException } from '../../../common/exceptions/unauthorized-dispute.exception';

describe('Project Domain Model Helper', () => {
  it('should verify participant correctly', () => {
    const project = new Project('p-1', 'c-1', 'f-1', 'IN_PROGRESS');
    expect(project.isParticipant('c-1')).toBe(true);
    expect(project.isParticipant('f-1')).toBe(true);
    expect(project.isParticipant('external')).toBe(false);
  });

  it('should allow in_progress status for dispute eligibility', () => {
    const project = new Project('p-1', 'c-1', 'f-1', 'IN_PROGRESS');
    expect(() => project.checkDisputeEligibility()).not.toThrow();
  });

  it('should throw ProjectCancelledException for CANCELLED or Cancelado status', () => {
    const project1 = new Project('p-1', 'c-1', 'f-1', 'CANCELLED');
    const project2 = new Project('p-1', 'c-1', 'f-1', 'Cancelado');
    expect(() => project1.checkDisputeEligibility()).toThrow(ProjectCancelledException);
    expect(() => project2.checkDisputeEligibility()).toThrow(ProjectCancelledException);
  });

  it('should throw ProjectAlreadyCompletedException for COMPLETED status', () => {
    const project = new Project('p-1', 'c-1', 'f-1', 'COMPLETED');
    expect(() => project.checkDisputeEligibility()).toThrow(ProjectAlreadyCompletedException);
  });

  it('should allow authorized participants', () => {
    const project = new Project('p-1', 'c-1', 'f-1', 'IN_PROGRESS');
    expect(() => project.checkUserAuthorization('c-1')).not.toThrow();
    expect(() => project.checkUserAuthorization('f-1')).not.toThrow();
  });

  it('should throw UnauthorizedDisputeException for external users', () => {
    const project = new Project('p-1', 'c-1', 'f-1', 'IN_PROGRESS');
    expect(() => project.checkUserAuthorization('external')).toThrow(UnauthorizedDisputeException);
  });
});
