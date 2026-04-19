import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sha256 } from 'js-sha256';
import { Session } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async authenticateSession(token: string): Promise<Session | null> {
    const hashedToken = sha256(token);
    return await this.prisma.session.findUnique({ where: { token: hashedToken } });
  }

  async getMembership(userId: string): Promise<Membership | null> {
    return await this.prisma.membership.findUnique({ where: { userId } });
  }
}
