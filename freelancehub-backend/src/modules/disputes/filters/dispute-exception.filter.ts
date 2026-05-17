import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UnauthorizedDisputeException } from '../../../common/exceptions/unauthorized-dispute.exception';
import { ProjectNotFoundException } from '../../../common/exceptions/project-not-found.exception';
import { DisputeAlreadyExistsException } from '../../../common/exceptions/dispute-already-exists.exception';
import { ProjectCancelledException } from '../../../common/exceptions/project-cancelled.exception';

/**
 * Filtro de Exceções especializado para o domínio de Disputas.
 * Traduz as exceções de domínio e aplicação do FreelanceHub para os status HTTP corretos de acordo com a UC13.8.
 */
@Catch()
export class DisputeExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message || 'Erro interno do servidor';

    // Mapeamento explícito das exceções de domínio para status HTTP correspondentes
    if (exception instanceof UnauthorizedDisputeException) {
      status = HttpStatus.FORBIDDEN; // 403
      message = exception.message;
    } else if (exception instanceof ProjectNotFoundException) {
      status = HttpStatus.NOT_FOUND; // 404
      message = exception.message;
    } else if (exception instanceof DisputeAlreadyExistsException) {
      status = HttpStatus.CONFLICT; // 409
      message = exception.message;
    } else if (exception instanceof ProjectCancelledException) {
      status = HttpStatus.CONFLICT; // 409 (conforme especificação da UC13.8)
      message = exception.message;
    } else if (exception instanceof HttpException) {
      // Outras exceções HTTP nativas do NestJS
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      message = typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody
        ? (responseBody as any).message
        : exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: HttpStatus[status] || 'Error',
    });
  }
}
