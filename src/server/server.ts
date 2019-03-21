//  Express sample Node application
import * as path from "path";
import cookieParser from "cookie-parser";
import application, * as express from "express";
import compression from "compression";
import config from "../../config";
import * as routers from "./router/";
const server = application();

server.use(compression());
server.use(cookieParser());
Object.keys(routers).forEach(key => {
  server.use("/", routers[key]);
});
server.use(
  express.static(path.resolve(__dirname, "../../dist/client"), {
    extensions: ["html"],
    setHeaders(res, url) {
      // html文件不缓存
      if (url.match(/\.html$/)) {
        res.removeHeader("Etag");
        res.removeHeader("Last-Modified");
        res.setHeader("Cache-Control", "private, no-cache, no-store");
        res.setHeader("Expires", "0");
        res.setHeader("Pragma", "no-cache");
      }
    }
  })
);
server.listen(config.port, "0.0.0.0", error => {
  if (error) {
    console.log(error);
  }
  console.log("%s: Node server started on %s:%d ...", new Date(), "0.0.0.0", config.port);
});
