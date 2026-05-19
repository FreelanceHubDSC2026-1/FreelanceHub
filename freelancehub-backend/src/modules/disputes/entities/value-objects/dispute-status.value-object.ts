import { DisputeStatusEnum } from '../../../../common/enums/dispute-status.enum';

export class DisputeStatus {
  private readonly value: DisputeStatusEnum;

  constructor(value: DisputeStatusEnum) {
    if (!value || !Object.values(DisputeStatusEnum).includes(value)) {
      throw new Error(`Status de disputa inválido: ${value}`);
    }
    this.value = value;
  }

  getValue(): DisputeStatusEnum {
    return this.value;
  }

  isOpen(): boolean {
    return this.value === DisputeStatusEnum.ABERTA;
  }

  isResolved(): boolean {
    return this.value === DisputeStatusEnum.RESOLVIDA;
  }

  equals(other: DisputeStatus): boolean {
    return this.value === other.getValue();
  }
}
