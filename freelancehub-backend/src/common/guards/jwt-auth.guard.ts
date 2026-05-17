import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * Guard de Autenticação JWT simplificado para a camada HTTP do FreelanceHub.
 * Em ambiente de produção, este Guard integraria com PassportJWT ou outra estratégia.
 * Nos testes E2E, ele é substituído pelo MockAuthGuard para simular autenticação flexível.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'] || request.headers['authorization'];
    
    if (!userId) {
      return false; // 401 Unauthorized se não houver identificador
    }

    // Anexa as informações básicas do usuário na requisição para consumo no Controller
    request.user = {
      id: userId,
      role: request.headers['x-user-role'] || 'CLIENT',
    };

    return true;
  }
}
