// @ts-expect-error TODO: remover suppressão ampla
// 
import { prisma } from "@birthub/database";

export async function inviteCleanupJob() {
  return prisma.invite.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  });
}

