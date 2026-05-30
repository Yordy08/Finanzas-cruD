import { c as useRuntimeConfig } from "../server.mjs";
const useMvpUserId = () => {
  const config = useRuntimeConfig();
  const mvpUserId = config?.public?.MVP_USER_ID;
  if (!mvpUserId || typeof mvpUserId !== "string" || !mvpUserId.trim()) {
    return "";
  }
  if (mvpUserId.trim() === "MVP_USER_ID_REPLACE_ME") {
    return "";
  }
  return mvpUserId.trim();
};
export {
  useMvpUserId as u
};
//# sourceMappingURL=useMvpUserId-ynCeH7hQ.js.map
