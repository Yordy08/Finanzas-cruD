import { b as defineEventHandler } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const ping_get = defineEventHandler(() => {
  return { ok: true };
});

export { ping_get as default };
//# sourceMappingURL=ping.get.mjs.map
