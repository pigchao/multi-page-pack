import { Router } from "express";
import { isNotNull } from "../../isomorphism/fun";
import { cookieKeys, urlParameterKeys, supportLanguage } from "../../isomorphism/setting";
import webpackJson from "../../webpack.json";

const router = Router();

const getCustomLanguage = (req, res) => {
  let hlQuery = req.query[urlParameterKeys.languageKey];
  let hlCookie = req.cookies[cookieKeys.languageKey];
  if (typeof hlQuery === "object" && hlQuery.constructor === Array) {
    hlQuery = hlQuery[0];
  }
  if (typeof hlCookie === "object" && hlCookie.constructor === Array) {
    hlCookie = hlCookie[0];
  }
  let hl;
  if (isNotNull(hlQuery)) {
    hl = supportLanguage.indexOf(hlQuery) > -1 ? hlQuery : "en";
    if (hl !== hlCookie) {
      res.cookie(cookieKeys.languageKey, hl, {
        maxAge: 1000 * 60 * 60 * 24 * 365
      });
    }
  } else if (isNotNull(hlCookie) && supportLanguage.indexOf(hlCookie) > -1) {
    hl = hlCookie;
  } else {
    let acceptLanguage = req.headers["accept-language"];
    if (typeof acceptLanguage === "string") {
      acceptLanguage = [acceptLanguage];
    }
    hl = acceptLanguage.some(key => ["zh", "zh_CN", "zh-CN"].indexOf(key) > -1) ? "zh" : "en";
    if (hl !== hlCookie) {
      res.cookie(cookieKeys.languageKey, hl, {
        maxAge: 1000 * 60 * 60 * 24 * 365
      });
    }
  }
  return hl;
};

Object.keys(webpackJson)
  .filter(path => webpackJson[path].i18n)
  .forEach(i18nPath => {
    router.get(`/${i18nPath}(\.html)?`, (req, res, next) => {
      const language = getCustomLanguage(req, res);
      req.url = `/${i18nPath}_${language}.html`;
      next();
    });
  });

export default router;
