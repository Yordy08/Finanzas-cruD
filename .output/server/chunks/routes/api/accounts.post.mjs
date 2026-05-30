import { p as prisma } from '../../_/prisma.mjs';
import { z } from 'zod';
import { b as defineEventHandler, u as readBody, c as createError } from '../../_/nitro.mjs';
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
  name: z.string().min(1),
  balance: z.number().optional()
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
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }
  return await prisma.account.create({
    data: {
      name,
      balance,
      userId
    }
  });
});

export { accounts_post as default };
//# sourceMappingURL=accounts.post.mjs.map
