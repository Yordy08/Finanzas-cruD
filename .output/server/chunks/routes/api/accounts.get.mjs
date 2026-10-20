import { g as getAccessScope, a as prisma } from '../../_/access.mjs';
import { z } from 'zod';
import { b as defineEventHandler, k as getQuery, c as createError } from '../../_/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const QuerySchema = z.object({
  userId: z.string().min(1)
});
const accounts_get = defineEventHandler(async (event) => {
  const query = await getQuery(event);
  const parsed = QuerySchema.safeParse(query);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid query", data: parsed.error.flatten() });
  }
  const { userId } = parsed.data;
  const scope = await getAccessScope(userId);
  return await prisma.account.findMany({
    where: scope.coupleId ? { OR: [{ userId: { in: scope.memberIds } }, { coupleId: scope.coupleId }] } : { userId },
    orderBy: { createdAt: "desc" }
  });
});

export { accounts_get as default };
//# sourceMappingURL=accounts.get.mjs.map
