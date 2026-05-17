import { DisputeReason } from './dispute-reason.value-object';
import { DisputeStatus } from './dispute-status.value-object';
import { DisputeStatusEnum } from '../../../../common/enums/dispute-status.enum';
import { InvalidDisputeReasonException } from '../../../../common/exceptions/invalid-dispute-reason.exception';

describe('Disputes Module Value Objects', () => {
  describe('DisputeReason', () => {
    it('should create a valid DisputeReason when string is 10 or more characters', () => {
      const reason = new DisputeReason('O motivo da disputa precisa ter mais de dez caracteres.');
      expect(reason.getValue()).toBe('O motivo da disputa precisa ter mais de dez caracteres.');
    });

    it('should throw InvalidDisputeReasonException when reason is less than 10 characters', () => {
      expect(() => new DisputeReason('Curto')).toThrow(InvalidDisputeReasonException);
    });

    it('should throw InvalidDisputeReasonException when reason is empty or null', () => {
      expect(() => new DisputeReason('')).toThrow(InvalidDisputeReasonException);
    });

    it('should compare equality of two reasons', () => {
      const reason1 = new DisputeReason('Texto explicativo longo suficiente.');
      const reason2 = new DisputeReason('Texto explicativo longo suficiente.');
      const reason3 = new DisputeReason('Outro texto explicativo longo suficiente.');
      expect(reason1.equals(reason2)).toBe(true);
      expect(reason1.equals(reason3)).toBe(false);
    });
  });

  describe('DisputeStatus', () => {
    it('should create a valid DisputeStatus from enum', () => {
      const status = new DisputeStatus(DisputeStatusEnum.ABERTA);
      expect(status.getValue()).toBe(DisputeStatusEnum.ABERTA);
      expect(status.isOpen()).toBe(true);
      expect(status.isResolved()).toBe(false);
    });

    it('should throw an error for invalid status value', () => {
      expect(() => new DisputeStatus('INVALIDO' as any)).toThrow('Status de disputa inválido: INVALIDO');
    });

    it('should compare equality of two statuses', () => {
      const status1 = new DisputeStatus(DisputeStatusEnum.ABERTA);
      const status2 = new DisputeStatus(DisputeStatusEnum.ABERTA);
      const status3 = new DisputeStatus(DisputeStatusEnum.RESOLVIDA);
      expect(status1.equals(status2)).toBe(true);
      expect(status1.equals(status3)).toBe(false);
    });
  });
});
