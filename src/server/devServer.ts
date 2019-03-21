//  Express sample Node application
import webpack from "webpack";
import cookieParser from "cookie-parser";
import WebpackDevServer from "webpack-dev-server";
import webpackConfig from "../../webpack.base";
import config from "../../config";
import * as routers from "./router/";

const compiler = webpack(webpackConfig);
const app = new WebpackDevServer(compiler, {
  hot: true,
  inline: true,
  disableHostCheck: true,
  compress: true,
  before(server) {
    server.use(cookieParser());
    Object.keys(routers).forEach(key => {
      server.use("/", routers[key]);
    });
  }
  // https: true
});
app.listen(config.port, "0.0.0.0", error => {
  if (error) {
    console.log(error);
  }
  console.log("%s: Node server started on %s:%d ...", new Date(), "0.0.0.0", config.port);
});
