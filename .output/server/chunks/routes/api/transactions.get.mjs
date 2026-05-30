import { p as prisma } from '../../_/prisma.mjs';
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
  userId: z.string().min(1),
  accountId: z.string().min(1).optional(),
  type: z.enum(["income", "expense"]).optional()
});
const transactions_get = defineEventHandler(async (event) => {
  const query = await getQuery(event);
  const parsed = QuerySchema.safeParse(query);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid query", data: parsed.error.flatten() });
  }
  const { userId, accountId, type } = parsed.data;
  return await prisma.transaction.findMany({
    where: {
      userId,
      ...accountId ? { accountId } : {},
      ...type ? { type } : {}
    },
    include: {
      account: true
    },
    orderBy: { createdAt: "desc" }
  });
});

export { transactions_get as default };
//# sourceMappingURL=transactions.get.mjs.map
