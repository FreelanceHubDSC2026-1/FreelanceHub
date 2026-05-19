import { InvalidDisputeReasonException } from '../../../../common/exceptions/invalid-dispute-reason.exception';

export class DisputeReason {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length < 10) {
      throw new InvalidDisputeReasonException();
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: DisputeReason): boolean {
    return this.value === other.getValue();
  }
}
