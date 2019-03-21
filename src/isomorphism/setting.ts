export const isMobile = typeof navigator !== "undefined" && /mobile|android|ios|iphone/i.test(navigator.userAgent);
export const isIOS = typeof navigator !== "undefined" && /ios|iphone|ipad/i.test(navigator.userAgent);
export const isAndroid = typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
export const supportLanguage = ["zh", "en"];
export const urlParameterKeys = { languageKey: "lang" };
export const cookieKeys = { languageKey: "lang" };
