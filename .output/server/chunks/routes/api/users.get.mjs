import { b as defineEventHandler } from '../../_/nitro.mjs';
import { p as prisma } from '../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const users_get = defineEventHandler(async () => {
  return await prisma.user.findMany();
});

export { users_get as default };
//# sourceMappingURL=users.get.mjs.map
