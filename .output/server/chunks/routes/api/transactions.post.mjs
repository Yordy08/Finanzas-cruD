import { r as requireUser, p as parseDate, a as prisma } from '../../_/access.mjs';
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
  accountId: z.string().min(1),
  type: z.union([z.enum(["income", "expense"]), z.enum(["ingreso", "gasto"])]),
  amount: z.number().finite().positive(),
  category: z.string().trim().min(1).max(80),
  description: z.string().max(500).optional(),
  date: z.string().optional(),
  scope: z.enum(["individual", "shared"]).default("individual")
});
const transactions_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid body", data: parsed.error.flatten() });
  }
  const { userId, accountId, amount, category, description } = parsed.data;
  await requireUser(userId);
  const typeInput = parsed.data.type;
  const type = typeInput === "ingreso" ? "income" : typeInput === "gasto" ? "expense" : typeInput;
  const date = parsed.data.date ? parseDate(parsed.data.date) : /* @__PURE__ */ new Date();
  return await prisma.$transaction(async (tx) => {
    const account = await tx.account.findFirst({ where: { id: accountId, userId } });
    if (!account) {
      throw createError({ statusCode: 404, statusMessage: "Account not found for user" });
    }
    const signedAmount = type === "income" ? amount : -amount;
    const transaction = await tx.transaction.create({
      data: {
        type,
        amount,
        category,
        description,
        date,
        userId,
        recordedById: userId,
        accountId,
        scope: parsed.data.scope
      }
    });
    await tx.account.update({
      where: { id: accountId },
      data: { balance: { increment: signedAmount } }
    });
    return transaction;
  });
});

export { transactions_post as default };
//# sourceMappingURL=transactions.post.mjs.map
