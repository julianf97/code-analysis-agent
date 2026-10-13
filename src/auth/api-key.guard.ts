import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();
    const received = request.headers['x-api-key'];
    const expected = this.configService.getOrThrow<string>('ADMIN_API_KEY');

    if (typeof received !== 'string') {
      throw new UnauthorizedException({
        error: { code: 'UNAUTHORIZED', message: 'API key inválida' },
      });
    }

    const receivedBuffer = Buffer.from(received);
    const expectedBuffer = Buffer.from(expected);

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      throw new UnauthorizedException({
        error: { code: 'UNAUTHORIZED', message: 'API key inválida' },
      });
    }

    return true;
  }
}
