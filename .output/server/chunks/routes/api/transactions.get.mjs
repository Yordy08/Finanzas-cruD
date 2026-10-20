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
  userId: z.string().min(1),
  accountId: z.string().min(1).optional(),
  type: z.enum(["income", "expense"]).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  recordedById: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50)
});
const transactions_get = defineEventHandler(async (event) => {
  const query = await getQuery(event);
  const parsed = QuerySchema.safeParse(query);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid query", data: parsed.error.flatten() });
  }
  const { userId, accountId, type, from, to, category, search, recordedById, page, pageSize } = parsed.data;
  const scope = await getAccessScope(userId);
  return await prisma.transaction.findMany({
    where: {
      userId: { in: scope.memberIds },
      ...accountId ? { accountId } : {},
      ...type ? { type } : {},
      ...category ? { category } : {},
      ...recordedById ? { recordedById } : {},
      ...search ? { description: { contains: search, mode: "insensitive" } } : {},
      ...from || to ? { date: { ...from ? { gte: /* @__PURE__ */ new Date(`${from}T00:00:00`) } : {}, ...to ? { lte: /* @__PURE__ */ new Date(`${to}T23:59:59.999`) } : {} } } : {}
    },
    include: {
      account: true,
      recordedBy: { select: { id: true, name: true, email: true } }
    },
    orderBy: { date: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize
  });
});

export { transactions_get as default };
//# sourceMappingURL=transactions.get.mjs.map
