import { a1 as useRuntimeConfig } from './server.mjs';

const useMvpUserId = () => {
  var _a;
  const config = useRuntimeConfig();
  const mvpUserId = (_a = config == null ? void 0 : config.public) == null ? void 0 : _a.MVP_USER_ID;
  if (!mvpUserId || typeof mvpUserId !== "string" || !mvpUserId.trim()) {
    return "";
  }
  if (mvpUserId.trim() === "MVP_USER_ID_REPLACE_ME") {
    return "";
  }
  return mvpUserId.trim();
};

export { useMvpUserId as u };
//# sourceMappingURL=useMvpUserId-CtE5Cm3w.mjs.map
