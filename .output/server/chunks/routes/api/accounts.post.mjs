import { g as getAccessScope, a as prisma } from '../../_/access.mjs';
import { z } from 'zod';
import { b as defineEventHandler, v as readBody, c as createError } from '../../_/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const BodySchema = z.object({
  userId: z.string().min(1),
  name: z.string().trim().min(1).max(100),
  balance: z.number().finite().nonnegative().optional()
});
const accounts_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid body", data: parsed.error.flatten() });
  }
  const { userId, name } = parsed.data;
  const balance = (_a = parsed.data.balance) != null ? _a : 0;
  const scope = await getAccessScope(userId);
  return await prisma.account.create({
    data: {
      name,
      balance,
      userId,
      coupleId: scope.coupleId
    }
  });
});

export { accounts_post as default };
//# sourceMappingURL=accounts.post.mjs.map
