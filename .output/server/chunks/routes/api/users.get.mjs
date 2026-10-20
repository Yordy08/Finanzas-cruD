import { b as defineEventHandler, k as getQuery, c as createError } from '../../_/nitro.mjs';
import { g as getAccessScope, a as prisma } from '../../_/access.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const users_get = defineEventHandler(async (event) => {
  const userId = String(getQuery(event).userId || "");
  if (!userId) throw createError({ statusCode: 400, statusMessage: "userId is required" });
  const scope = await getAccessScope(userId);
  return prisma.user.findMany({ where: { id: { in: scope.memberIds } }, select: { id: true, name: true, email: true } });
});

export { users_get as default };
//# sourceMappingURL=users.get.mjs.map
